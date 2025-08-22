from tortoise import fields, models
from tortoise.contrib.pydantic import pydantic_model_creator
from passlib.hash import bcrypt

class User(models.Model):
    id = fields.IntField(pk=True)
    username = fields.CharField(max_length=50, unique=True)
    email = fields.CharField(max_length=255, unique=True)
    password_hash = fields.CharField(max_length=128)
    full_name = fields.CharField(max_length=100)
    is_active = fields.BooleanField(default=True)
    is_admin = fields.BooleanField(default=False)
    preferred_language = fields.CharField(max_length=10, default="es")
    created_at = fields.DatetimeField(auto_now_add=True)

    def verify_password(self, password):
        return bcrypt.verify(password, self.password_hash)

    @classmethod
    async def create_user(cls, username, email, password, full_name, is_admin=False):
        return await cls.create(
            username=username,
            email=email,
            password_hash=bcrypt.hash(password),
            full_name=full_name,
            is_admin=is_admin
        )

    class Meta:
        table = "users"

# Crear modelos Pydantic para validación y serialización
User_Pydantic = pydantic_model_creator(User, name="User", exclude=["password_hash"])
UserIn_Pydantic = pydantic_model_creator(User, name="UserIn", exclude_readonly=True)
