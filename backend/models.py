from typing import Optional
from datetime import datetime
from sqlmodel import SQLModel, Field

class Note(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    title: str
    content: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    is_public: bool = False
    slug: Optional[str] = Field(default=None, index=True, unique=True)
