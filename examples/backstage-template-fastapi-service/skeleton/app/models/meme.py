from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field


class MemeBase(BaseModel):
    name: str = Field(..., min_length=1, description="Name of the meme")
    description: str = Field(default="", description="Description of the meme")
    category: str = Field(..., min_length=1, description="Category of the meme")
    rating: float = Field(..., ge=0, le=10, description="Rating from 0 to 10")
    views: int = Field(..., ge=0, description="Number of views")
    max_shares: int = Field(..., ge=0, description="Maximum number of shares")


class MemeCreate(MemeBase):
    pass


class MemeUpdate(MemeBase):
    pass


class Meme(MemeBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class HealthResponse(BaseModel):
    status: str
    service: str
    timestamp: str
    version: str


class HelloResponse(BaseModel):
    message: str
    timestamp: str


class StatusResponse(BaseModel):
    service: str
    status: str
    uptime: float
    environment: str
