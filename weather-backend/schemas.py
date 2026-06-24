from pydantic import BaseModel, field_validator
from datetime import datetime

# Used when creating a new weather record (POST request)
class WeatherRecordCreate(BaseModel):
    location: str
    start_date: str
    end_date: str

    @field_validator('start_date', 'end_date')
    @classmethod
    def validate_date_format(cls, value: str) -> str:
        try:
            datetime.strptime(value, "%Y-%m-%d")
            return value
        except ValueError:
            raise ValueError("Dates must be in YYYY-MM-DD format.")

# Used when a user updates their custom notes (PUT request)
class WeatherRecordUpdate(BaseModel):
    user_notes: str

# Used when returning data back to the frontend (The Response structure)
class WeatherRecordResponse(BaseModel):
    id: int
    location_input: str
    resolved_location: str
    start_date: str
    end_date: str
    temperature_avg: float
    weather_condition: str
    user_notes: str

    class Config:
        from_attributes = True