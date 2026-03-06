import os
import json
from typing import Dict, Any, List, Optional
from datetime import datetime
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from dotenv import load_dotenv

load_dotenv()

# Service configuration
SERVICE_NAME = "${{values.name}}"
SERVICE_DESCRIPTION = "${{values.description}}"

app = FastAPI(title=SERVICE_NAME, description=SERVICE_DESCRIPTION, version="1.0.0")

# Sample excursions database for the AI assistant
EXCURSIONS_DB = [
    {
        "id": 1,
        "name": "Mountain Hiking Adventure",
        "description": "A thrilling hike through the scenic mountain trails with breathtaking views",
        "location": "Rocky Mountains",
        "price": 75.00,
        "duration": 6,
        "max_participants": 12,
        "difficulty": "moderate",
        "season": "spring,summer,fall",
    },
    {
        "id": 2,
        "name": "City Food Tour",
        "description": "Explore the best local cuisine and hidden food gems in the city",
        "location": "Downtown",
        "price": 45.00,
        "duration": 3,
        "max_participants": 8,
        "difficulty": "easy",
        "season": "all",
    },
    {
        "id": 3,
        "name": "Coastal Kayaking",
        "description": "Paddle through crystal clear waters and explore hidden coves",
        "location": "Pacific Coast",
        "price": 95.00,
        "duration": 4,
        "max_participants": 6,
        "difficulty": "moderate",
        "season": "summer,fall",
    },
    {
        "id": 4,
        "name": "Desert Photography Workshop",
        "description": "Learn photography techniques while capturing stunning desert landscapes",
        "location": "Mojave Desert",
        "price": 120.00,
        "duration": 8,
        "max_participants": 10,
        "difficulty": "easy",
        "season": "winter,spring",
    },
]


class ChatRequest(BaseModel):
    message: str
    context: str = ""


class ChatResponse(BaseModel):
    response: str
    confidence: float = 1.0
    suggested_excursions: Optional[List[Dict]] = None


class ExcursionRecommendation(BaseModel):
    excursions: List[Dict]
    reasoning: str


@app.get("/health")
async def health_check():
    return {
        "status": "OK",
        "service": SERVICE_NAME,
        "version": "1.0.0",
        "timestamp": datetime.utcnow().isoformat(),
    }


@app.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """
    Excursions AI Assistant endpoint.
    Provides recommendations and answers questions about excursions.
    """
    message = request.message.lower()
    response_text = ""
    confidence = 0.8
    suggested_excursions = None

    # Greeting responses
    if any(word in message for word in ["hello", "hi", "hey", "greetings"]):
        response_text = "Hello! I'm your excursions assistant. I can help you find the perfect adventure! You can ask me about:\n\n• Excursions by location or activity\n• Price ranges and duration\n• Difficulty levels\n• Seasonal recommendations\n• Specific excursion details\n\nWhat kind of adventure are you looking for?"
        confidence = 0.9

    # Help responses
    elif any(word in message for word in ["help", "what can you do", "capabilities"]):
        response_text = "I can help you discover amazing excursions! Here's what I can do:\n\n🏔️ **Find excursions by:**\n• Location (mountain, city, coast, desert)\n• Activity type (hiking, food, kayaking, photography)\n• Price range (budget, moderate, premium)\n• Difficulty (easy, moderate, challenging)\n• Duration (half-day, full-day)\n• Season (spring, summer, fall, winter)\n\n💡 **Get recommendations for:**\n• Best excursions for beginners\n• Adventure activities\n• Family-friendly options\n• Seasonal activities\n\nJust tell me what you're interested in!"
        confidence = 0.95

    # Location-based searches
    elif any(word in message for word in ["mountain", "hiking", "trail", "peak"]):
        matching = [e for e in EXCURSIONS_DB if "mountain" in e["location"].lower() or "hiking" in e["name"].lower()]
        if matching:
            suggested_excursions = matching
            response_text = f"I found {len(matching)} mountain/hiking excursions for you! The Mountain Hiking Adventure is perfect - it's a moderate 6-hour trek through scenic trails with breathtaking views. Would you like more details about any of these?"
            confidence = 0.9

    elif any(word in message for word in ["food", "cuisine", "restaurant", "eat", "dining"]):
        matching = [e for e in EXCURSIONS_DB if "food" in e["name"].lower() or "cuisine" in e["description"].lower()]
        if matching:
            suggested_excursions = matching
            response_text = "Perfect choice! I found food-related excursions for you. The City Food Tour is a 3-hour culinary adventure exploring the best local cuisine and hidden gems downtown. It's easy difficulty and great for food lovers!"
            confidence = 0.9

    elif any(word in message for word in ["water", "kayak", "paddle", "ocean", "sea", "coast"]):
        matching = [e for e in EXCURSIONS_DB if "coast" in e["location"].lower() or "kayak" in e["name"].lower()]
        if matching:
            suggested_excursions = matching
            response_text = "Great for water enthusiasts! Coastal Kayaking offers 4 hours of paddling through crystal clear waters and exploring hidden coves. It's moderate difficulty and perfect for summer or fall."
            confidence = 0.9

    elif any(word in message for word in ["photo", "photography", "camera", "picture"]):
        matching = [e for e in EXCURSIONS_DB if "photo" in e["name"].lower()]
        if matching:
            suggested_excursions = matching
            response_text = "Perfect for photography lovers! The Desert Photography Workshop is an 8-hour experience in the Mojave Desert where you'll learn techniques while capturing stunning landscapes. Best during winter or spring!"
            confidence = 0.9

    # Budget-related queries
    elif any(word in message for word in ["cheap", "budget", "affordable", "price", "cost"]):
        affordable = [e for e in EXCURSIONS_DB if e["price"] < 60]
        if affordable:
            suggested_excursions = affordable
            response_text = f"I found {len(affordable)} budget-friendly excursions under $60! The City Food Tour is just $45 for 3 hours of culinary exploration. Great value for money!"
            confidence = 0.85

    # Difficulty-based queries
    elif any(word in message for word in ["easy", "beginner", "simple", "family"]):
        easy_excursions = [e for e in EXCURSIONS_DB if e["difficulty"] == "easy"]
        if easy_excursions:
            suggested_excursions = easy_excursions
            response_text = f"Perfect for beginners! I found {len(easy_excursions)} easy-difficulty excursions. Both the City Food Tour and Desert Photography Workshop are beginner-friendly with great experiences!"
            confidence = 0.9

    # Season-based queries
    elif any(word in message for word in ["summer", "winter", "spring", "fall", "autumn"]):
        season = None
        if "summer" in message:
            season = "summer"
        elif "winter" in message:
            season = "winter"
        elif "spring" in message:
            season = "spring"
        elif any(word in message for word in ["fall", "autumn"]):
            season = "fall"

        if season:
            seasonal = [e for e in EXCURSIONS_DB if season in e["season"]]
            if seasonal:
                suggested_excursions = seasonal
                response_text = f"Great timing! I found {len(seasonal)} excursions perfect for {season}. Each offers unique experiences during this season!"
                confidence = 0.85

    # Default response for unrecognized queries
    else:
        response_text = "I'd love to help you find the perfect excursion! Could you tell me more about what you're looking for? For example:\n\n• What type of activity interests you? (hiking, food, water sports, photography)\n• What's your preferred difficulty level? (easy, moderate, challenging)\n• Any specific location preferences?\n• What's your budget range?\n\nI have information about mountain hiking, city food tours, coastal kayaking, and desert photography workshops!"
        confidence = 0.6
        # Show all excursions as suggestions
        suggested_excursions = EXCURSIONS_DB[:2]  # Show first 2 as examples

    return ChatResponse(
        response=response_text,
        confidence=confidence,
        suggested_excursions=suggested_excursions,
    )


@app.get("/excursions")
async def get_excursions():
    """Get all available excursions."""
    return EXCURSIONS_DB


@app.get("/excursions/search")
async def search_excursions(
    location: Optional[str] = None,
    max_price: Optional[float] = None,
    difficulty: Optional[str] = None,
    season: Optional[str] = None,
):
    """Search excursions by criteria."""
    results = EXCURSIONS_DB.copy()

    if location:
        results = [e for e in results if location.lower() in e["location"].lower()]

    if max_price:
        results = [e for e in results if e["price"] <= max_price]

    if difficulty:
        results = [e for e in results if e["difficulty"].lower() == difficulty.lower()]

    if season:
        results = [e for e in results if season.lower() in e["season"].lower()]

    return {
        "excursions": results,
        "total": len(results),
        "filters": {
            "location": location,
            "max_price": max_price,
            "difficulty": difficulty,
            "season": season,
        },
    }


@app.post("/recommend", response_model=ExcursionRecommendation)
async def recommend_excursions(preferences: Dict[str, Any]):
    """Get personalized excursion recommendations."""
    budget = preferences.get("budget", 1000)
    difficulty = preferences.get("difficulty", "any")
    interests = preferences.get("interests", [])
    season = preferences.get("season", "any")

    recommendations = []
    reasoning_parts = []

    for excursion in EXCURSIONS_DB:
        score = 0
        reasons = []

        # Budget check
        if excursion["price"] <= budget:
            score += 30
            reasons.append(f"fits your budget of ${budget}")

        # Difficulty match
        if difficulty == "any" or excursion["difficulty"] == difficulty:
            score += 25
            if difficulty != "any":
                reasons.append(f"matches your {difficulty} difficulty preference")

        # Interest matching
        for interest in interests:
            if interest.lower() in excursion["name"].lower() or interest.lower() in excursion["description"].lower():
                score += 20
                reasons.append(f"aligns with your interest in {interest}")

        # Season matching
        if season == "any" or season in excursion["season"]:
            score += 15
            if season != "any":
                reasons.append(f"perfect for {season} season")

        if score >= 40:  # Minimum threshold for recommendation
            excursion_copy = excursion.copy()
            excursion_copy["recommendation_score"] = score
            excursion_copy["reasons"] = reasons
            recommendations.append(excursion_copy)

    # Sort by score (highest first)
    recommendations.sort(key=lambda x: x["recommendation_score"], reverse=True)

    reasoning = f"Based on your preferences, I found {len(recommendations)} excursions that match your criteria. "
    if recommendations:
        top_pick = recommendations[0]
        reasoning += f"My top recommendation is '{top_pick['name']}' because it {', '.join(top_pick['reasons'])}."

    return ExcursionRecommendation(excursions=recommendations[:3], reasoning=reasoning)  # Return top 3


@app.get("/")
async def root():
    return {
        "service": SERVICE_NAME,
        "message": "Excursions AI Assistant - Your personal adventure guide!",
        "version": "1.0.0",
        "endpoints": {
            "chat": "POST /chat - Chat with the AI assistant",
            "excursions": "GET /excursions - Get all excursions",
            "search": "GET /excursions/search - Search excursions by criteria",
            "recommend": "POST /recommend - Get personalized recommendations",
            "health": "GET /health - Health check",
            "docs": "GET /docs - API documentation",
        },
        "capabilities": [
            "Natural language excursion search",
            "Personalized recommendations",
            "Activity and location-based suggestions",
            "Budget and difficulty filtering",
            "Seasonal activity recommendations",
        ],
    }


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
