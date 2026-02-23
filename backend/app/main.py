import uvicorn
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Annotated
from sqlalchemy.orm import Session

from app.api.v1.ticket_router import router as ticket_router
from app.persistence.database import engine, Base, SessionLocal
from app.persistence import ticket_orm

app = FastAPI(title="Banto__o API - IPB Help Center")
ticket_orm.Base.metadata.create_all(bind=engine)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Ganti dengan URL Vercel FE jika sudah ada
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Registrasi Router
app.include_router(ticket_router, prefix="/api/v1", tags=["Tickets"])

@app.get("/")
def root():
    return {"message": "Banto__o API is online!"}

