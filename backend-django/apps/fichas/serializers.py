from rest_framework import serializers
from .models import Ficha

class FichaSerializer(serializers.ModelSerializer): # Serializador para el modelo Ficha
    class Meta:
        model = Ficha
        fields = '__all__'  # Incluir todos los campos del modelo