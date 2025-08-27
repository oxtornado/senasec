import os
from dotenv import load_dotenv

# Intentar cargar variables de entorno desde .env si existe
try:
    load_dotenv()
except:
    pass

# Configuración por defecto para desarrollo
# Usamos SQLite para facilitar el desarrollo sin necesidad de configurar MySQL
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite://db.sqlite3")
SECRET_KEY = os.getenv("SECRET_KEY", "your_super_secret_key_for_jwt")
ENVIRONMENT = os.getenv("ENVIRONMENT", "development")

TORTOISE_ORM = {
    "connections": {
        "default": DATABASE_URL
    },
    "apps": {
        "models": {
            "models": ["app.models.user", "app.models.inventory", "app.models.loan"],
            "default_connection": "default",
        }
    },
    "use_tz": False,
}

async def init_db():
    from tortoise import Tortoise
    await Tortoise.init(config=TORTOISE_ORM)
    await Tortoise.generate_schemas()
