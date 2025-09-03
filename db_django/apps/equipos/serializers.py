from rest_framework import serializers
from .models import Equipo

class EquipoSerializer(serializers.ModelSerializer):  # Serializador para el modelo Equipo
    class Meta:
        model = Equipo
        fields = '__all__'  # Incluir todos los campos del modelo