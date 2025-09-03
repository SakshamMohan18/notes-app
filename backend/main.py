from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
import uuid

app = FastAPI()

# Allow frontend to connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, set to your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------
# Data Models
# ---------------------
class NoteCreate(BaseModel):
    title: str
    content: str

class Note(NoteCreate):
    id: int
    slug: str = None

# ---------------------
# In-memory DB
# ---------------------
notes: List[Note] = []
counter = 1

# ---------------------
# Routes
# ---------------------
@app.get("/notes", response_model=List[Note])
def get_notes():
    return notes

@app.post("/notes", response_model=Note)
def create_note(note: NoteCreate):
    global counter
    new_note = Note(id=counter, title=note.title, content=note.content)
    counter += 1
    notes.append(new_note)
    return new_note

@app.get("/notes/{note_id}", response_model=Note)
def get_note(note_id: int):
    for note in notes:
        if note.id == note_id:
            return note
    raise HTTPException(status_code=404, detail="Note not found")

@app.put("/notes/{note_id}", response_model=Note)
def update_note(note_id: int, updated: NoteCreate):
    for note in notes:
        if note.id == note_id:
            note.title = updated.title
            note.content = updated.content
            return note
    raise HTTPException(status_code=404, detail="Note not found")

@app.delete("/notes/{note_id}")
def delete_note(note_id: int):
    global notes
    notes = [n for n in notes if n.id != note_id]
    return {"message": "Note deleted"}

@app.post("/notes/{note_id}/share")
def share_note(note_id: int):
    for note in notes:
        if note.id == note_id:
            slug = str(uuid.uuid4())[:8]
            note.slug = slug
            return {"url": f"http://localhost:5173/s/{slug}"}
    raise HTTPException(status_code=404, detail="Note not found")

@app.get("/notes/slug/{slug}", response_model=Note)
def get_note_by_slug(slug: str):
    for note in notes:
        if note.slug == slug:
            return note
    raise HTTPException(status_code=404, detail="Note not found")
