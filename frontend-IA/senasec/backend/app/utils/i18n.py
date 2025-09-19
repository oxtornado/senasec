import json
import os
from typing import Dict, Any

class I18n:
    def __init__(self):
        self.translations = {}
        self._load_translations()

    def _load_translations(self):
        translations_dir = os.path.join(os.path.dirname(__file__), "../translations")
        for filename in os.listdir(translations_dir):
            if filename.endswith(".json"):
                language = filename.split(".")[0]
                with open(os.path.join(translations_dir, filename), "r", encoding="utf-8") as f:
                    self.translations[language] = json.load(f)

    def get_translation(self, key: str, language: str = "es") -> str:
        if language not in self.translations:
            language = "es"  # Default to Spanish

        return self.translations[language].get(key, key)

i18n = I18n()
