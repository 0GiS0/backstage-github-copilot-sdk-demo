# FastAPI Service Template Usage Guide

This guide explains how to use the **FastAPI Service** template effectively to create new Python APIs and microservices.

## Before You Start

### Prerequisites

- Access to your organization's Backstage instance
- Python 3.11+ installed on your development machine
- Basic understanding of Python and FastAPI development
- Required permissions to create repositories in your organization

### Understanding This Template

**Template Type:** Backend Service
**Primary Use Case:** Create high-performance Python APIs and microservices
**Technologies:** Python, FastAPI, SQLAlchemy, Pydantic

## Step-by-Step Usage

### 1. Access the Template

1. **Open Backstage:** Navigate to your organization's Backstage instance
2. **Create Component:** Click on "Create Component" or "Create" button
3. **Find Template:** Look for "FastAPI Service Template" in the available templates
4. **Start Creation:** Click "Choose" to begin using this template

### 2. Complete the Form

Fill in the required parameters for your new FastAPI service.

### 3. Post-Creation Setup

```bash
# Clone the repository
git clone https://github.com/your-org/your-fastapi-service.git
cd your-fastapi-service

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run the service
uvicorn src.main:app --reload

# Access API documentation at http://localhost:8000/docs
```

## Development

### Creating API Endpoints

```python
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from . import models, schemas
from .database import get_db

router = APIRouter()

@router.post("/users/", response_model=schemas.User)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = models.User(**user.dict())
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user
```

### Data Models with Pydantic

```python
from pydantic import BaseModel, EmailStr
from datetime import datetime

class UserBase(BaseModel):
    email: EmailStr
    name: str

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    created_at: datetime
    
    class Config:
        orm_mode = True
```

## Testing

```python
from fastapi.testclient import TestClient
from .main import app

client = TestClient(app)

def test_create_user():
    response = client.post("/users/", json={
        "email": "test@example.com",
        "name": "Test User",
        "password": "testpass"
    })
    assert response.status_code == 200
    assert response.json()["email"] == "test@example.com"
```

## Resources

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [SQLAlchemy Documentation](https://docs.sqlalchemy.org/)
- [Pydantic Documentation](https://pydantic-docs.helpmanual.io/)
