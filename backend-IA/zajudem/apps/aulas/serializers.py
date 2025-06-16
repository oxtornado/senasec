from rest_framework import serializers
from .models import Aula

class AulaSerializer(serializers.ModelSerializer): # Serializador para el modelo Aula
    class Meta:
        model = Aula
        fields = '__all__'  # Incluir todos los campos del modelo