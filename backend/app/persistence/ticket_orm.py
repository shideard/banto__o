from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime

from app.persistence.database import Base


class KategoriTiketORM(Base):
    __tablename__ = "kategori_tiket"

    id            = Column(Integer, primary_key=True, index=True)
    nama_kategori = Column(String(100), nullable=False, unique=True)

    tiket = relationship("TiketORM", back_populates="kategori")


class TiketORM(Base):
    __tablename__ = "tiket"

    id             = Column(Integer, primary_key=True, index=True)
    subjek         = Column(String(255), nullable=False)
    tanggal_dibuat = Column(DateTime, default=datetime.utcnow)
    status         = Column(String(50), default="DIBUAT")

    kategori_id  = Column(Integer, ForeignKey("kategori_tiket.id"), nullable=True)
    mahasiswa_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    staf_id      = Column(Integer, ForeignKey("users.id"), nullable=True)

    kategori  = relationship("KategoriTiketORM", back_populates="tiket")
    mahasiswa = relationship("UserORM", foreign_keys=[mahasiswa_id], back_populates="tiket_diajukan")
    staf      = relationship("UserORM", foreign_keys=[staf_id],      back_populates="tiket_dikelola")

    # Komposisi — terhapus jika tiket dihapus
    pengajuan  = relationship("PengajuanORM",  back_populates="tiket", uselist=False, cascade="all, delete-orphan")
    komentar   = relationship("KomentarORM",   back_populates="tiket", cascade="all, delete-orphan")
    notifikasi = relationship("NotifikasiORM", back_populates="tiket")


class PengajuanORM(Base):
    """Komposisi 1-to-1 dengan Tiket — menyimpan deskripsi detail."""
    __tablename__ = "pengajuan"

    id        = Column(Integer, primary_key=True, index=True)
    tiket_id  = Column(Integer, ForeignKey("tiket.id"), unique=True, nullable=False)
    deskripsi = Column(Text, nullable=False)

    tiket    = relationship("TiketORM", back_populates="pengajuan")
    lampiran = relationship("LampiranORM", back_populates="pengajuan", cascade="all, delete-orphan")


class LampiranORM(Base):
    """Komposisi dari Pengajuan — endpoint upload butuh storage service."""
    __tablename__ = "lampiran"

    id           = Column(Integer, primary_key=True, index=True)
    pengajuan_id = Column(Integer, ForeignKey("pengajuan.id"), nullable=False)
    nama_file    = Column(String(255), nullable=False)
    tipe_file    = Column(String(100), nullable=False)

    pengajuan = relationship("PengajuanORM", back_populates="lampiran")


class KomentarORM(Base):
    __tablename__ = "komentar"

    id         = Column(Integer, primary_key=True, index=True)
    tiket_id   = Column(Integer, ForeignKey("tiket.id"),  nullable=False)
    penulis_id = Column(Integer, ForeignKey("users.id"),  nullable=True)   # nullable sebelum auth
    role       = Column(String(50), nullable=False)
    isi        = Column(Text, nullable=False)
    waktu      = Column(DateTime, default=datetime.utcnow)

    tiket   = relationship("TiketORM", back_populates="komentar")
    penulis = relationship("UserORM",  back_populates="komentar")

class ChatSessionORM(Base):
    __tablename__ = "chat_sessions"

    id         = Column(Integer, primary_key=True, index=True)
    user_id    = Column(Integer, ForeignKey("users.id"), nullable=False)
    title      = Column(String(255), default="Percakapan Baru")
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    messages = relationship("ChatMessageORM", back_populates="session", cascade="all, delete-orphan")


class ChatMessageORM(Base):
    __tablename__ = "chat_messages"

    id         = Column(Integer, primary_key=True, index=True)
    session_id = Column(Integer, ForeignKey("chat_sessions.id"), nullable=False)
    type       = Column(String(10), nullable=False)   # "user" atau "bot"
    text       = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    session = relationship("ChatSessionORM", back_populates="messages")