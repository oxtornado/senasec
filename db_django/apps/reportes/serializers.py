from rest_framework import serializers
from .models import Reporte # Importando el modelo Reporte

class ReporteSerializer(serializers.ModelSerializer): # Serializador para el modelo Reporte
    class Meta:
        model = Reporte
        fields = '__all__'  # Incluir todos los campos del modelo
        extra_kwargs = {
            'fecha_reporte': {'read_only': True},  # Para que la ultima actualizacion no sea visible en la API
        }