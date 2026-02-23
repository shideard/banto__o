# from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
# from sqlalchemy.orm import relationship
# from datetime import datetime
# from app.persistence.database import Base
#
# class Tickets(Base):
#     __tablename__ = 'tickets'
#     id = Column(Integer, primary_key=True, index=True)
#     subject = Column(String(255), nullable=False)
#     description = Column(Text, nullable=False)
#     category = Column(String(100), nullable=False)
#     status = Column(String(50), default="Open")  # Default awal
#
#     # Hubungan One-to-Many: Satu tiket bisa punya banyak komentar
#     comments = relationship("Comment", back_populates="tickets", cascade="all, delete-orphan")
#
# class Comment(Base):
#     __tablename__ = "comments"
#
#     id = Column(Integer, primary_key=True, index=True)
#     ticket_id = Column(Integer, ForeignKey("tickets.id"))  # Menghubungkan ke tabel tickets
#     user_id = Column(String(50), nullable=False)  # ID Mahasiswa atau Staff
#     role = Column(String(50), nullable=False)  # 'Mahasiswa' atau 'Staff Administrasi'
#     message = Column(Text, nullable=False)
#     created_at = Column(DateTime, default=datetime.utcnow)
#
#     # Menghubungkan balik ke tiket
#     ticket = relationship("Ticket", back_populates="comments")
#
#