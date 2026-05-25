from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm, OAuth2PasswordBearer
from sqlalchemy.orm import Session
from app.persistence.database import get_db
from app.services.user_service import UserService
from app.persistence.repositories.user_repository import UserRepository
from app.schemas.user_schema import UserResponse, UserCreate, NotifikasiResponse
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
    }


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")


def get_current_user(
    token: Annotated[str, Depends(oauth2_scheme)],
    user_service: UserService = Depends(get_user_service)
):
    payload = user_service.decode_access_token(token)
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
    payload: dict,
    db: Session = Depends(get_db),
    current_user: Annotated[UserORM, Depends(get_current_user)] = None
):
    if "nama" in payload:
        current_user.nama = payload["nama"]
    db.commit()
    db.refresh(current_user)
    return current_user


@router.get("/notifikasi", response_model=list[NotifikasiResponse])
def get_notifikasi(
    user_service: UserService = Depends(get_user_service),
    current_user: Annotated[UserORM, Depends(get_current_user)] = None
):
    return user_service.get_notifikasi(current_user.id)