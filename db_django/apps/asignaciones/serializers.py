from rest_framework import serializers
from .models import Asignacion

class AsignacionSerializer(serializers.ModelSerializer):  # Serializador para el modelo Asignacion
    class Meta:
        model = Asignacion
        fields = '__all__'  # Incluir todos los campos del modelo
        extra_kwargs = {
            'ultima_actualizacion': {'read_only': True},  # Para que la ultima actualizacion no sea visible en la API
        }