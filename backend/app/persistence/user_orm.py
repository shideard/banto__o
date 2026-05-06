from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime

from app.persistence.database import Base


class DivisiStafORM(Base):
    __tablename__ = "divisi_staf"

    id          = Column(Integer, primary_key=True, index=True)
    nama_divisi = Column(String(100), nullable=False, unique=True)

    staf = relationship("UserORM", back_populates="divisi")


class UserORM(Base):
    """
    Single-table inheritance untuk Mahasiswa & StafAdministrasi.
    Kolom 'role' membedakan keduanya: 'mahasiswa' | 'staf'.
    """
    __tablename__ = "users"

    id       = Column(Integer, primary_key=True, index=True)
    nama     = Column(String(100), nullable=False)
    email    = Column(String(100), unique=True, nullable=False)
    password = Column(String(255), nullable=False)   # TODO: hash dengan bcrypt saat auth diimplementasi
    role     = Column(String(20), nullable=False)    # 'mahasiswa' | 'staf'

    # Mahasiswa fields
    nim = Column(String(20), nullable=True, unique=True)

    # Staf fields
    divisi_id = Column(Integer, ForeignKey("divisi_staf.id"), nullable=True)
    divisi    = relationship("DivisiStafORM", back_populates="staf")

    # Relationships
    tiket_diajukan = relationship(
        "TiketORM", foreign_keys="TiketORM.mahasiswa_id", back_populates="mahasiswa"
    )
    tiket_dikelola = relationship(
        "TiketORM", foreign_keys="TiketORM.staf_id", back_populates="staf"
    )
    komentar   = relationship("KomentarORM", back_populates="penulis")
    notifikasi = relationship("NotifikasiORM", back_populates="user")


class NotifikasiORM(Base):
    __tablename__ = "notifikasi"

    id       = Column(Integer, primary_key=True, index=True)
    user_id  = Column(Integer, ForeignKey("users.id"), nullable=False)
    tiket_id = Column(Integer, ForeignKey("tiket.id"), nullable=True)
    pesan    = Column(String(500), nullable=False)
    waktu    = Column(DateTime, default=datetime.utcnow)
    dibaca   = Column(Boolean, default=False)

    user  = relationship("UserORM", back_populates="notifikasi")
    tiket = relationship("TiketORM", back_populates="notifikasi")