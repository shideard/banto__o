import uvicorn
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from typing import List, Annotated
from sqlalchemy.orm import Session
import os

from app.persistence.database import engine, Base, SessionLocal
from app.persistence import ticket_orm
from app.api.v1.user_router import router as user_router
from app.api.v1.ticket_router import router as ticket_router
from app.api.v1.notification_router import router as notification_router

app = FastAPI(title="Banto__o API - IPB Help Center")
ticket_orm.Base.metadata.create_all(bind=engine)
Base.metadata.create_all(bind=engine)

origins = [
    "http://localhost:5173",
    "http://localhost:3000",
    "https://banto-o.vercel.app",
    "https://banto--o.vercel.app",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_origin_regex=r"https://.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Registrasi Router
app.include_router(user_router, prefix="/api/v1/auth", tags=["Authentication"])
app.include_router(ticket_router, prefix="/api/v1", tags=["Tickets"])
app.include_router(notification_router, prefix="/api/v1", tags=["Notifikasi"])

# Serve file lampiran yang diupload
os.makedirs("uploads", exist_ok=True)
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

@app.get("/")
def root():
    return {"message": "Banto__o API is online!"}