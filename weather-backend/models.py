from sqlalchemy import Column, Integer, String, Float
from database import Base

class WeatherRecord(Base):
    __tablename__ = "weather_records"

    id = Column(Integer, primary_key=True, index=True)
    location_input = Column(String, index=True)
    resolved_location = Column(String)
    start_date = Column(String)
    end_date = Column(String)
    temperature_avg = Column(Float)
    weather_condition = Column(String)
    user_notes = Column(String, default="No notes added.")