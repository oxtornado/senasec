import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from tortoise.contrib.fastapi import register_tortoise
from app.db.config import TORTOISE_ORM
from app.api import auth, users, inventory, loans, i18n
from dotenv import load_dotenv

# Intentar cargar variables de entorno desde .env si existe
try:
    load_dotenv()
except:
    pass

app = FastAPI(
    title="SENASEC API",
    description="API para el Sistema de Seguridad Inteligente para Aulas",
    version="1.0.0"
)

# Configurar CORS - Configuración específica para el frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173", 
        "http://localhost:5174", 
        "http://localhost:5182", 
        "http://localhost:5184"  # Puerto actual del frontend
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Registrar rutas
app.include_router(auth.router, tags=["auth"])
app.include_router(users.router, prefix="/api", tags=["users"])
app.include_router(inventory.router, prefix="/api", tags=["inventory"])
app.include_router(loans.router, prefix="/api", tags=["loans"])
app.include_router(i18n.router, prefix="/api", tags=["i18n"])

# Registrar Tortoise ORM
register_tortoise(
    app,
    config=TORTOISE_ORM,
    generate_schemas=True,
    add_exception_handlers=True,
)

@app.get("/")
async def root():
    return {"message": "Bienvenido a la API de SENASEC"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
