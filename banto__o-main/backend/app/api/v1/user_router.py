from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm, OAuth2PasswordBearer
from sqlalchemy.orm import Session
from app.persistence.database import get_db
from app.services.user_service import UserService
from app.schemas.user_schema import UserResponse, UserCreate, NotifikasiResponse, PasswordUpdate
from app.persistence.user_orm import UserORM, NotifikasiORM
from typing import Annotated


router = APIRouter()
user_service = UserService()


@router.post("/register", response_model=UserResponse)
def register(user: UserCreate, db: Session = Depends(get_db)):
    try:
        return user_service.create_user(db, user)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error registrasi: {str(e)}"
        )


@router.post("/login")
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    # Cari user berdasarkan email (username di form_data)
    from app.persistence.user_orm import UserORM
    user = db.query(UserORM).filter(UserORM.email == form_data.username).first()

    if not user or not user_service.verify_password(form_data.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email atau password salah",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Ticket router butuh payload.user_id
    access_token = user_service.create_access_token(data={"sub": user.email})
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "role": user.role,
        "nama": user.nama,
        "email": user.email,
        "id": user.id,          # ← TAMBAHKAN INI
        "nim": user.nim,        # ← untuk mahasiswa
    }




oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")


def get_current_user(token: Annotated[str, Depends(oauth2_scheme)], db: Session = Depends(get_db)):
    payload = user_service.decode_access_token(token)

    email = payload.get("sub")
    user = db.query(UserORM).filter(UserORM.email == email).first()
    if not user:
        raise HTTPException(status_code=401, detail="User tidak ditemukan.")
    return user

@router.get("/me", response_model=UserResponse)
def get_profile(current_user: Annotated[UserORM, Depends(get_current_user)]):
    return current_user

@router.patch("/me", response_model=UserResponse)
def update_profile(
    payload: dict,
    db: Session = Depends(get_db),
    current_user: Annotated[UserORM, Depends(get_current_user)] = None
):
    if "nama" in payload:
        current_user.nama = payload["nama"]
    if "divisi_id" in payload and current_user.role == "staf":
        current_user.divisi_id = payload["divisi_id"]
    db.commit()
    db.refresh(current_user)
    return current_user

@router.get("/notifikasi", response_model=list[NotifikasiResponse])
def get_notifikasi(
    db: Session = Depends(get_db),
    current_user: Annotated[UserORM, Depends(get_current_user)] = None
):
    return db.query(NotifikasiORM).filter(
        NotifikasiORM.user_id == current_user.id
    ).order_by(NotifikasiORM.waktu.desc()).limit(20).all()

@router.patch("/notifikasi/{notif_id}/baca", response_model=NotifikasiResponse)
def mark_notifikasi_read(
    notif_id: int,
    db: Session = Depends(get_db),
    current_user: Annotated[UserORM, Depends(get_current_user)] = None
):
    try:
        return user_service.tandai_dibaca(db, notif_id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.patch("/me/password")
def update_password(
    payload: PasswordUpdate,
    db: Session = Depends(get_db),
    current_user: Annotated[UserORM, Depends(get_current_user)] = None
):
    if not user_service.verify_password(payload.password_lama, current_user.password):
        raise HTTPException(status_code=400, detail="Password lama tidak sesuai")
    current_user.password = user_service.get_password_hash(payload.password_baru)
    db.commit()
    return {"message": "Password berhasil diubah"}