from sqlalchemy.orm import Session
from app.persistence.ticket_orm import TicketORM, CommentORM
from app.domain.ticket_entity import TicketDomain
from app.schemas.ticket_schema import CommentCreate, TicketCreate, TicketUpdateStatus


class TicketService:
    def create_new_ticket(self, db: Session, data: TicketCreate):
        # 1. Simpan Data Tiket Utama
        new_ticket = TicketORM(
            subject=data.subject,
            description=data.description,
            category=data.category,
            status="Open"
        )
        db.add(new_ticket)
        db.commit()
        db.refresh(new_ticket)
        return new_ticket

    def verify_and_update(self, db: Session, ticket_id: int, data: TicketUpdateStatus, user_id: str):
        # 1. Cari Tiket di DB
        ticket_orm = db.query(TicketORM).filter(TicketORM.id == ticket_id).first()
        if not ticket_orm:
            raise ValueError("Tiket tidak ditemukan.")

        # 2. Panggil Logic di Domain (Pure Python)
        domain = TicketDomain(id=ticket_orm.id, subject=ticket_orm.subject,
                              description=ticket_orm.description, category=ticket_orm.category)

        # Cek apakah revisi tapi catatan kosong
        domain.validate_revision(data.new_status, data.admin_note)

        # 3. Update Status & Simpan Komentar ke DB
        ticket_orm.status = data.new_status
        if data.admin_note:
            new_comment = CommentORM(
                ticket_id=ticket_id,
                user_id=user_id,
                role="Staff Administrasi",
                message=data.admin_note
            )
            db.add(new_comment)

        db.commit()
        db.refresh(ticket_orm)
        return {"message": "Status updated successfully", "status": ticket_orm.status}

    def add_comment(self, db: Session, ticket_id: int, data: CommentCreate, user_id: str, role: str):
        # 1. Pastikan Tiketnya ada di database
        ticket_orm = db.query(TicketORM).filter(TicketORM.id == ticket_id).first()
        if not ticket_orm:
            raise ValueError("Tiket tidak ditemukan, tidak bisa mengirim komentar.")

        # 2. Gunakan Domain Logic untuk validasi pesan
        domain = TicketDomain(id=ticket_orm.id, subject=ticket_orm.subject,
                              description=ticket_orm.description, category=ticket_orm.category)

        # Validasi: Pesan tidak boleh kosong (Logic dari Entity)
        domain.add_comment_logic(user_id=user_id, role=role, message=data.message)

        # 3. Simpan ke Database via ORM
        new_comment = CommentORM(
            ticket_id=ticket_id,
            user_id=user_id,
            role=role,
            message=data.message
        )

        db.add(new_comment)
        db.commit()
        db.refresh(new_comment)
        return new_comment