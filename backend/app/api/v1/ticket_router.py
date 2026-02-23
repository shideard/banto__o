from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import Annotated


from app.persistence.database import SessionLocal
from app.schemas.ticket_schema import TicketCreate, TicketResponse, TicketUpdateStatus, CommentCreate, CommentResponse
from app.services.ticket_service import TicketService

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

db_dependency = Annotated[Session, Depends(get_db)]
ticket_service = TicketService()

# 1. Endpoint Mengajukan Tiket Baru
@router.post("/tickets", response_model=TicketResponse)
def create_ticket(payload: TicketCreate, db: db_dependency):
    return ticket_service.create_new_ticket(db, payload)

# 2. Endpoint Update Status & Tambah Komentar (Verifikasi)
@router.patch("/tickets/{ticket_id}/status")
def update_status(ticket_id: int, payload: TicketUpdateStatus, db: db_dependency):
    try:
        # user_id dummy
        return ticket_service.verify_and_update(db, ticket_id, payload, user_id="STAFF_001")
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/tickets/{ticket_id}/comments", response_model=CommentResponse)
def post_comment(ticket_id: int, payload: CommentCreate, db: db_dependency):
    try:
        # Untuk sementara user_id dan role kita hardcode (nanti pakai Auth)
        # Misal: ini adalah Mahasiswa yang membalas
        return ticket_service.add_comment(
            db=db,
            ticket_id=ticket_id,
            data=payload,
            user_id="MHS_123",
            role="Mahasiswa"
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))