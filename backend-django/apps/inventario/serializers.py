from rest_framework import serializers
from .models import Inventario

class InventarioSerializer(serializers.ModelSerializer): # Serializador para el modelo Inventario
    class Meta:
        model = Inventario
        fields = '__all__'  # Incluir todos los campos del modelo
        extra_kwargs = {
            'ultima_actualizacion': {'read_only': True},  # Para que la ultima actualizacion no sea visible en la API
        }