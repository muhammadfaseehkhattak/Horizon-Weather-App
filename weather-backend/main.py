from fastapi import FastAPI, Depends, HTTPException, Response
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import requests
import csv
import io
import json
from datetime import datetime

import models, schemas, database

app = FastAPI(title="Weather App Backend")

# Enable CORS so our React frontend can communicate with the backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Automatically create database tables on startup
models.Base.metadata.create_all(bind=database.engine)


def get_coordinates(location_name: str):
    
    if "," in location_name and any(char.isdigit() for char in location_name):
        lat, lon = location_name.split(",")
        return {
            "name": f"Lat: {lat.strip()}, Lon: {lon.strip()}",
            "lat": float(lat.strip()),
            "lon": float(lon.strip())
        }

    # Otherwise, do the normal search
    geo_url = f"https://geocoding-api.open-meteo.com/v1/search?name={location_name}&count=1&language=en&format=json"
    response = requests.get(geo_url).json()
    
    if not response.get("results"):
        raise HTTPException(status_code=404, detail=f"Location '{location_name}' could not be verified.")
    
    result = response["results"][0]
    return {
        "name": f"{result.get('name')}, {result.get('country')}",
        "lat": result.get("latitude"),
        "lon": result.get("longitude")
    }


def fetch_weather_data(lat: float, lon: float, start_date: str, end_date: str):
    # Fetch current metrics alongside the 5-day forecast array blocks
    api_url = f"https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min,weather_code&timezone=auto"
    res = requests.get(api_url).json()
    
    if "current" not in res or "daily" not in res:
        raise HTTPException(status_code=400, detail="Could not retrieve real-time data arrays.")
        
    # 1. Capture Precise Current Metrics
    current_temp = res["current"]["temperature_2m"]
    current_humidity = res["current"]["relative_humidity_2m"]
    current_wind = res["current"]["wind_speed_10m"]
    
    # 2. Build the 5-day forecast string structure to send to frontend
    daily_data = res["daily"]
    forecast_days = []
    total_max_temp = 0
    
    # Loop over up to 5 days returned by user selection windows
    loop_limit = min(5, len(daily_data["time"]))
    for i in range(loop_limit):
        max_t = daily_data["temperature_2m_max"][i]
        min_t = daily_data["temperature_2m_min"][i]
        code = daily_data["weather_code"][i] or 0
        
        # Simple short label mapping per day
        day_cond = "Sunny" if code <= 3 else "Rainy" if code <= 67 else "Stormy"
        forecast_days.append(f"{daily_data['time'][i]}={max_t}={min_t}={day_cond}")
        total_max_temp += max_t
        
    avg_max_temp = round(total_max_temp / loop_limit, 1) if loop_limit > 0 else current_temp
    forecast_serialized = ";".join(forecast_days)
    
    # 3. Dynamic Base Weather State Definition
    base_code = daily_data["weather_code"][0] if daily_data["weather_code"] else 0
    if base_code == 0: condition = "Sunny/Clear"
    elif base_code in [1, 2, 3]: condition = "Partly Cloudy"
    elif base_code in [45, 48]: condition = "Foggy"
    elif base_code in [51, 53, 55, 61, 63, 65, 80, 81, 82]: condition = "Rainy"
    else: condition = "Stormy"
    
    # Pack EVERYTHING into our database text column string smoothly
    # Pattern: Condition | Wind | Humidity | AvgMax | ForecastArray
    packed_payload = f"{condition}|{current_wind}|{current_humidity}|{avg_max_temp}|{forecast_serialized}"
    
    return round(current_temp, 1), packed_payload


# --- CRUD: CREATE ---
@app.post("/api/weather", response_model=schemas.WeatherRecordResponse)
def create_weather_record(payload: schemas.WeatherRecordCreate, db: Session = Depends(database.get_db)):
    # 1. Validate date logic
    if payload.end_date < payload.start_date:
        raise HTTPException(status_code=400, detail="End date cannot be prior to start date.")
        
    # 2. Get coords and validate location
    geo_data = get_coordinates(payload.location)
    
    # 3. Fetch real weather metrics
    avg_temp, condition = fetch_weather_data(geo_data["lat"], geo_data["lon"], payload.start_date, payload.end_date)
    
    # 4. Save directly into database
    new_record = models.WeatherRecord(
        location_input=payload.location,
        resolved_location=geo_data["name"],
        start_date=payload.start_date,
        end_date=payload.end_date,
        temperature_avg=avg_temp,
        weather_condition=condition
    )
    db.add(new_record)
    db.commit()
    db.refresh(new_record)
    return new_record


# --- CRUD: READ ---
@app.get("/api/weather", response_model=list[schemas.WeatherRecordResponse])
def read_all_records(db: Session = Depends(database.get_db)):
    return db.query(models.WeatherRecord).all()


# --- CRUD: UPDATE ---
@app.put("/api/weather/{record_id}", response_model=schemas.WeatherRecordResponse)
def update_record_notes(record_id: int, payload: schemas.WeatherRecordUpdate, db: Session = Depends(database.get_db)):
    record = db.query(models.WeatherRecord).filter(models.WeatherRecord.id == record_id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Record not found.")
        
    record.user_notes = payload.user_notes
    db.commit()
    db.refresh(record)
    return record


# --- CRUD: DELETE ---
@app.delete("/api/weather/{record_id}")
def delete_record(record_id: int, db: Session = Depends(database.get_db)):
    record = db.query(models.WeatherRecord).filter(models.WeatherRecord.id == record_id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Record not found.")
        
    db.delete(record)
    db.commit()
    return {"detail": f"Record {record_id} deleted successfully."}


# --- DATA EXPORT ---
@app.get("/api/weather/export")
def export_weather_data(format: str = "json", db: Session = Depends(database.get_db)):
    records = db.query(models.WeatherRecord).all()
    
    if format == "json":
        data = [
            {
                "id": r.id, "location_input": r.location_input, "resolved_location": r.resolved_location,
                "start_date": r.start_date, "end_date": r.end_date, "temperature_avg": r.temperature_avg,
                "weather_condition": r.weather_condition, "user_notes": r.user_notes
            } for r in records
        ]
        return Response(content=json.dumps(data, indent=4), media_type="application/json", headers={"Content-Disposition": "attachment; filename=weather_history.json"})
        
    elif format == "csv":
        output = io.StringIO()
        writer = csv.writer(output)
        writer.writerow(["ID", "User Input", "Resolved Location", "Start Date", "End Date", "Avg Temp (C)", "Condition", "User Notes"])
        
        for r in records:
            writer.writerow([r.id, r.location_input, r.resolved_location, r.start_date, r.end_date, r.temperature_avg, r.weather_condition, r.user_notes])
            
        return Response(content=output.getvalue(), media_type="text/csv", headers={"Content-Disposition": "attachment; filename=weather_history.csv"})
        
    raise HTTPException(status_code=400, detail="Invalid format type. Choose 'json' or 'csv'.")