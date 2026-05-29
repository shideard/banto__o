from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm, OAuth2PasswordBearer
from sqlalchemy.orm import Session
from app.persistence.database import get_db
from app.services.user_service import UserService
from app.persistence.repositories.user_repository import UserRepository
from app.schemas.user_schema import UserResponse, UserCreate, NotifikasiResponse, PasswordUpdate, UserUpdate
from app.persistence.user_orm import UserORM, NotifikasiORM
from typing import Annotated



router = APIRouter()


def get_user_service(db: Session = Depends(get_db)) -> UserService:
    repo = UserRepository(db)
    return UserService(repo)


@router.post("/register", response_model=UserResponse)
def register(user: UserCreate, user_service: UserService = Depends(get_user_service)):
    try:
        return user_service.create_user(user)
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
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    user_service: UserService = Depends(get_user_service)
):
    user = user_service.repo.get_user_by_email(form_data.username)

    if not user or not user_service.verify_password(form_data.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email atau password salah",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token = user_service.create_access_token(data={"sub": user.email})
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "role": user.role,
        "nama": user.nama,
        "email": user.email,
        "id": user.id,
        "nim": user.nim,
        "telepon": user.telepon,
        "fakultas": user.fakultas,
        "departemen": user.departemen,
        "divisi_id": user.divisi_id,
    }


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")


def get_current_user(
    token: Annotated[str, Depends(oauth2_scheme)],
    user_service: UserService = Depends(get_user_service)
):
    try:
        payload = user_service.decode_access_token(token)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(e),
            headers={"WWW-Authenticate": "Bearer"},
        )
    email = payload.get("sub")
    user = user_service.repo.get_user_by_email(email)
    if not user:
        raise HTTPException(status_code=401, detail="User tidak ditemukan.")
    return user


@router.get("/me", response_model=UserResponse)
def get_profile(current_user: Annotated[UserORM, Depends(get_current_user)]):
    return current_user


@router.patch("/me", response_model=UserResponse)
def update_profile(
    payload: UserUpdate,
    db: Session = Depends(get_db),
    current_user: Annotated[UserORM, Depends(get_current_user)] = None
):
    if payload.nama is not None:
        current_user.nama = payload.nama
    if payload.nim is not None and current_user.role == "mahasiswa":
        current_user.nim = payload.nim
    if payload.telepon is not None and current_user.role == "mahasiswa":
        current_user.telepon = payload.telepon
    if payload.fakultas is not None and current_user.role == "mahasiswa":
        current_user.fakultas = payload.fakultas
    if payload.departemen is not None and current_user.role == "mahasiswa":
        current_user.departemen = payload.departemen
    if payload.divisi_id is not None and current_user.role == "staf":
        current_user.divisi_id = payload.divisi_id
    db.commit()
    db.refresh(current_user)
    return current_user


@router.get("/notifikasi", response_model=list[NotifikasiResponse])
def get_notifikasi(
    db: Session = Depends(get_db),
    user_service: UserService = Depends(get_user_service),

    current_user: Annotated[UserORM, Depends(get_current_user)] = None
):

    return db.query(NotifikasiORM).filter(
        NotifikasiORM.user_id == current_user.id
    ).order_by(NotifikasiORM.waktu.desc()).limit(20).all()



@router.patch("/notifikasi/{notif_id}/baca", response_model=NotifikasiResponse)
def mark_notifikasi_read(
    notif_id: int,
    db: Session = Depends(get_db),
    user_service: UserService = Depends(get_user_service),
    current_user: Annotated[UserORM, Depends(get_current_user)] = None
):
    try:
        return user_service.tandai_dibaca(notif_id)

    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.patch("/me/password")
def update_password(
    payload: PasswordUpdate,
    db: Session = Depends(get_db),
    user_service: UserService = Depends(get_user_service),
    current_user: Annotated[UserORM, Depends(get_current_user)] = None
):
    if not user_service.verify_password(payload.password_lama, current_user.password):

        raise HTTPException(status_code=400, detail="Password lama tidak sesuai")
    current_user.password = user_service.get_password_hash(payload.password_baru)
    db.commit()
    return {"message": "Password berhasil diubah"}


