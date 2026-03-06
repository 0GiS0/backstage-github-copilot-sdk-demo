from datetime import datetime
from typing import List

from fastapi import APIRouter, HTTPException

from app.models.meme import Meme, MemeCreate, MemeUpdate

router = APIRouter(prefix="/api/memes", tags=["memes"])

# In-memory storage for demonstration purposes
# In a real application, this would be replaced with a proper database
memes: List[Meme] = [
    Meme(
        id=1,
        name="Distracted Boyfriend",
        description=(
            "A man looking at another woman while his girlfriend looks "
            "disapprovingly"
        ),
        category="Classic",
        rating=9.5,
        views=1000000,
        max_shares=500000,
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow(),
    ),
    Meme(
        id=2,
        name="Loss - Four Panels",
        description=(
            "The legendary webcomic moment that spawned a thousand memes"
        ),
        category="Abstract",
        rating=8.7,
        views=2000000,
        max_shares=1000000,
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow(),
    ),
]
next_id = 3


@router.get("/", response_model=List[Meme])
async def get_all_memes():
    """Get all memes."""
    return memes


@router.get("/{meme_id}", response_model=Meme)
async def get_meme_by_id(meme_id: int):
    """Get a meme by ID."""
    meme = next((e for e in memes if e.id == meme_id), None)
    if not meme:
        raise HTTPException(
            status_code=404,
            detail=f"Meme with id {meme_id} not found",
        )
    return meme


@router.post("/", response_model=Meme, status_code=201)
async def create_meme(meme_data: MemeCreate):
    """Create a new meme."""
    global next_id

    new_meme = Meme(
        id=next_id,
        **meme_data.dict(),
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow(),
    )

    memes.append(new_meme)
    next_id += 1

    return new_meme


@router.put("/{meme_id}", response_model=Meme)
async def update_meme(meme_id: int, meme_data: MemeUpdate):
    """Update an existing meme."""
    meme = next((e for e in memes if e.id == meme_id), None)
    if not meme:
        raise HTTPException(
            status_code=404,
            detail=f"Meme with id {meme_id} not found",
        )

    # Update the meme
    update_data = meme_data.dict()
    for field, value in update_data.items():
        setattr(meme, field, value)

    meme.updated_at = datetime.utcnow()

    return meme


@router.delete("/{meme_id}", status_code=204)
async def delete_meme(meme_id: int):
    """Delete a meme."""
    global memes

    meme_index = next(
        (i for i, e in enumerate(memes) if e.id == meme_id),
        None,
    )
    if meme_index is None:
        raise HTTPException(
            status_code=404,
            detail=f"Meme with id {meme_id} not found",
        )

    memes.pop(meme_index)
    return
