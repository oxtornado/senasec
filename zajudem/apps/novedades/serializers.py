from rest_framework import serializers
from .models import Novedad

class NovedadSerializer(serializers.ModelSerializer):  # Serializador para el modelo Novedad
    class Meta:
        model = Novedad
        fields = '__all__'