from rest_framework import serializers
from .models import Ambiente
from apps.equipos.serializers import EquipoSerializer
from apps.novedades.serializers import NovedadSerializer

class AmbienteSerializer(serializers.ModelSerializer):  # Serializador para el modelo Ambiente
    equipos = EquipoSerializer(many=True, read_only=True)  # Relacionados por related_name='equipos'
    novedades = NovedadSerializer(many=True, read_only=True)  # Relacionados por related_name='novedades'

    class Meta:
        model = Ambiente
        fields = [
            'id',
            'nombre',
            'estado',
            'equipos',
            'novedades'
        ]