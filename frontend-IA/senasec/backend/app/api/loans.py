from fastapi import APIRouter, Depends, HTTPException, Query
from typing import List, Optional
from datetime import datetime
from app.models.loan import Loan, LoanStatus
from app.models.inventory import InventoryItem, ItemStatus
from app.models.user import User
from app.api.auth import get_current_active_user

router = APIRouter()

@router.get("/loans/", response_model=List[dict])
async def get_loans(
    status: Optional[LoanStatus] = None,
    current_user: User = Depends(get_current_active_user)
):
    query = Loan.filter(user=current_user)
    if status:
        query = query.filter(status=status)

    loans = await query.prefetch_related("item")
    return loans

@router.post("/loans/", response_model=dict)
async def create_loan(
    item_id: int,
    start_time: datetime,
    end_time: datetime,
    notes: Optional[str] = None,
    current_user: User = Depends(get_current_active_user)
):
    # Verificar que el ítem existe y está disponible
    item = await InventoryItem.get_or_none(id=item_id)
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")

    if item.status != ItemStatus.AVAILABLE:
        raise HTTPException(status_code=400, detail="Item is not available")

    # Verificar que las fechas son válidas
    if start_time >= end_time:
        raise HTTPException(status_code=400, detail="End time must be after start time")

    if start_time < datetime.now():
        raise HTTPException(status_code=400, detail="Start time cannot be in the past")

    # Crear el préstamo
    loan = await Loan.create(
        user=current_user,
        item=item,
        start_time=start_time,
        end_time=end_time,
        notes=notes,
        status=LoanStatus.PENDING
    )

    return loan

@router.put("/loans/{loan_id}/approve", response_model=dict)
async def approve_loan(
    loan_id: int,
    current_user: User = Depends(get_current_active_user)
):
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Not authorized")

    loan = await Loan.get_or_none(id=loan_id).prefetch_related("item")
    if not loan:
        raise HTTPException(status_code=404, detail="Loan not found")

    if loan.status != LoanStatus.PENDING:
        raise HTTPException(status_code=400, detail="Loan is not pending")

    # Actualizar el estado del préstamo
    loan.status = LoanStatus.ACTIVE
    await loan.save()

    # Actualizar el estado del ítem
    item = loan.item
    item.status = ItemStatus.IN_USE
    await item.save()

    return loan

@router.put("/loans/{loan_id}/return", response_model=dict)
async def return_loan(
    loan_id: int,
    current_user: User = Depends(get_current_active_user)
):
    loan = await Loan.get_or_none(id=loan_id).prefetch_related("item", "user")
    if not loan:
        raise HTTPException(status_code=404, detail="Loan not found")

    # Verificar que el usuario es el dueño del préstamo o un administrador
    if loan.user.id != current_user.id and not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Not authorized")

    if loan.status != LoanStatus.ACTIVE:
        raise HTTPException(status_code=400, detail="Loan is not active")

    # Actualizar el estado del préstamo
    loan.status = LoanStatus.RETURNED
    loan.actual_return_time = datetime.now()
    await loan.save()

    # Actualizar el estado del ítem
    item = loan.item
    item.status = ItemStatus.AVAILABLE
    await item.save()

    return loan
