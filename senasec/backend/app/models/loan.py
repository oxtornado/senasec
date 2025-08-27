from tortoise import fields, models
from tortoise.contrib.pydantic import pydantic_model_creator
from enum import Enum

class LoanStatus(str, Enum):
    PENDING = "pending"
    ACTIVE = "active"
    RETURNED = "returned"
    OVERDUE = "overdue"

class Loan(models.Model):
    id = fields.IntField(pk=True)
    user = fields.ForeignKeyField('models.User', related_name='loans')
    item = fields.ForeignKeyField('models.InventoryItem', related_name='loans')
    start_time = fields.DatetimeField()
    end_time = fields.DatetimeField()
    actual_return_time = fields.DatetimeField(null=True)
    status = fields.CharEnumField(LoanStatus, default=LoanStatus.PENDING)
    notes = fields.TextField(null=True)
    created_at = fields.DatetimeField(auto_now_add=True)
    updated_at = fields.DatetimeField(auto_now=True)

    class Meta:
        table = "loans"

# Crear modelos Pydantic
Loan_Pydantic = pydantic_model_creator(Loan, name="Loan")
LoanIn_Pydantic = pydantic_model_creator(Loan, name="LoanIn", exclude_readonly=True)
