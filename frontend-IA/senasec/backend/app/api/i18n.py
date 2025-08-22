from fastapi import APIRouter
from app.utils.i18n import i18n

router = APIRouter()

@router.get("/i18n/{language}")
async def get_translations(language: str):
    """Get all translations for a specific language"""
    if language not in i18n.translations:
        language = "es"  # Default to Spanish

    return i18n.translations[language]
