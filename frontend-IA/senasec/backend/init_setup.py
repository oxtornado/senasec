#!/usr/bin/env python
"""
Script de inicialización para SENASEC.
Este script crea un usuario administrador por defecto y algunos datos de ejemplo.
"""

import asyncio
import os
from tortoise import Tortoise
from app.db.config import TORTOISE_ORM
from app.models.user import User
from app.models.inventory import InventoryItem, ItemStatus
from app.core.security import get_password_hash

async def init_db():
    # Inicializar la conexión a la base de datos
    await Tortoise.init(config=TORTOISE_ORM)

    # Generar esquemas
    await Tortoise.generate_schemas()

    # Verificar si ya existe un usuario administrador
    admin = await User.get_or_none(username="admin")

    if not admin:
        print("Creando usuario administrador...")
        await User.create(
            username="admin",
            email="admin@senasec.com",
            password_hash=get_password_hash("admin123"),  # Cambiar en producción
            full_name="Administrador",
            is_admin=True
        )
        print("Usuario administrador creado con éxito.")
    else:
        print("El usuario administrador ya existe.")

    # Crear algunos elementos de inventario de ejemplo
    if await InventoryItem.all().count() == 0:
        print("Creando elementos de inventario de ejemplo...")

        await InventoryItem.create(
            name="Proyector EPSON",
            description="Proyector multimedia de alta definición",
            status=ItemStatus.AVAILABLE,
            location="Aula 101",
            serial_number="EP2023001"
        )

        await InventoryItem.create(
            name="Laptop Dell XPS",
            description="Laptop para presentaciones",
            status=ItemStatus.AVAILABLE,
            location="Aula 102",
            serial_number="DL2023001"
        )

        await InventoryItem.create(
            name="Cámara web Logitech",
            description="Cámara para videoconferencias",
            status=ItemStatus.AVAILABLE,
            location="Aula 103",
            serial_number="LG2023001"
        )

        print("Elementos de inventario creados con éxito.")
    else:
        print("Ya existen elementos en el inventario.")

    print("Inicialización completada.")

if __name__ == "__main__":
    asyncio.run(init_db())

    print("\nInformación de acceso:")
    print("----------------------")
    print("Usuario: admin")
    print("Contraseña: admin123")
    print("\n¡IMPORTANTE! Cambie la contraseña después del primer inicio de sesión.")
