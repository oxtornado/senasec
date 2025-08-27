from tortoise import fields, models
from tortoise.contrib.pydantic import pydantic_model_creator
from enum import Enum

class ItemStatus(str, Enum):
    AVAILABLE = "available"
    IN_USE = "in_use"
    MAINTENANCE = "maintenance"

class InventoryItem(models.Model):
    id = fields.IntField(pk=True)
    name = fields.CharField(max_length=100)
    description = fields.TextField(null=True)
    status = fields.CharEnumField(ItemStatus, default=ItemStatus.AVAILABLE)
    location = fields.CharField(max_length=100)
    serial_number = fields.CharField(max_length=100, null=True)
    image_url = fields.CharField(max_length=255, null=True)
    created_at = fields.DatetimeField(auto_now_add=True)
    updated_at = fields.DatetimeField(auto_now=True)

    class Meta:
        table = "inventory_items"

# Crear modelos Pydantic
InventoryItem_Pydantic = pydantic_model_creator(InventoryItem, name="InventoryItem")
InventoryItemIn_Pydantic = pydantic_model_creator(
    InventoryItem, name="InventoryItemIn", exclude_readonly=True
)
