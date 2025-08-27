from fastapi import APIRouter, Depends, HTTPException, Query
from typing import List, Optional
from app.models.inventory import InventoryItem, ItemStatus
from app.models.user import User
from app.api.auth import get_current_active_user

router = APIRouter()

@router.get("/inventory/", response_model=List[dict])
async def get_inventory_items(
    status: Optional[ItemStatus] = None,
    search: Optional[str] = None,
    current_user: User = Depends(get_current_active_user)
):
    query = InventoryItem.all()
    if status:
        query = query.filter(status=status)
    if search:
        query = query.filter(name__icontains=search)

    items = await query
    return items

@router.post("/inventory/", response_model=dict)
async def create_inventory_item(
    name: str,
    description: Optional[str] = None,
    location: str = "Almacén",
    serial_number: Optional[str] = None,
    image_url: Optional[str] = None,
    current_user: User = Depends(get_current_active_user)
):
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Not authorized")

    item = await InventoryItem.create(
        name=name,
        description=description,
        location=location,
        serial_number=serial_number,
        image_url=image_url
    )
    return item

@router.get("/inventory/{item_id}", response_model=dict)
async def get_inventory_item(
    item_id: int,
    current_user: User = Depends(get_current_active_user)
):
    item = await InventoryItem.get_or_none(id=item_id)
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    return item

@router.put("/inventory/{item_id}", response_model=dict)
async def update_inventory_item(
    item_id: int,
    name: Optional[str] = None,
    description: Optional[str] = None,
    status: Optional[ItemStatus] = None,
    location: Optional[str] = None,
    serial_number: Optional[str] = None,
    image_url: Optional[str] = None,
    current_user: User = Depends(get_current_active_user)
):
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Not authorized")

    item = await InventoryItem.get_or_none(id=item_id)
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")

    if name:
        item.name = name
    if description:
        item.description = description
    if status:
        item.status = status
    if location:
        item.location = location
    if serial_number:
        item.serial_number = serial_number
    if image_url:
        item.image_url = image_url

    await item.save()
    return item

@router.delete("/inventory/{item_id}", response_model=dict)
async def delete_inventory_item(
    item_id: int,
    current_user: User = Depends(get_current_active_user)
):
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Not authorized")

    item = await InventoryItem.get_or_none(id=item_id)
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")

    await item.delete()
    return {"message": "Item deleted successfully"}
