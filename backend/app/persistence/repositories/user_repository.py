# backend/app/persistence/repositories/user_repository.py
from sqlalchemy.orm import Session
from typing import List, Optional
from app.persistence.user_orm import UserORM, DivisiStafORM, NotifikasiORM

class UserRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_user_by_email(self, email: str) -> Optional[UserORM]:
        return self.db.query(UserORM).filter(UserORM.email == email).first()

    def get_user_by_nim(self, nim: str) -> Optional[UserORM]:
        return self.db.query(UserORM).filter(UserORM.nim == nim).first()

    def get_user_by_id(self, user_id: int) -> Optional[UserORM]:
        return self.db.query(UserORM).filter(UserORM.id == user_id).first()

    def create_user(self, user: UserORM) -> UserORM:
        self.db.add(user)
        self.db.commit()
        self.db.refresh(user)
        return user

    def create_divisi(self, divisi: DivisiStafORM) -> DivisiStafORM:
        self.db.add(divisi)
        self.db.commit()
        self.db.refresh(divisi)
        return divisi

    def get_all_divisi(self) -> List[DivisiStafORM]:
        return self.db.query(DivisiStafORM).all()

    def get_notifikasi_by_user_id(self, user_id: int) -> List[NotifikasiORM]:
        return (
            self.db.query(NotifikasiORM)
            .filter(NotifikasiORM.user_id == user_id)
            .order_by(NotifikasiORM.waktu.desc())
            .all()
        )

    def get_notifikasi_by_id(self, notif_id: int) -> Optional[NotifikasiORM]:
        return self.db.query(NotifikasiORM).filter(NotifikasiORM.id == notif_id).first()

    def update_notifikasi(self, notif: NotifikasiORM) -> NotifikasiORM:
        self.db.commit()
        self.db.refresh(notif)
        return notif
