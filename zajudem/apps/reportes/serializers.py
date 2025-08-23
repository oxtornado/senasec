from rest_framework import serializers
from .models import Reporte # Importando el modelo Reporte
from apps.programaciones.models import Programacion # Importando el modelo Programacion
from apps.users.models import Usuario # Importando el modelo Usuario
from apps.fichas.serializers import FichaSerializer # Importando el serializador FichaSerializer


class ReporteSerializer(serializers.ModelSerializer): # Serializador para el modelo Reporte
    programacion = serializers.PrimaryKeyRelatedField(queryset=Programacion.objects.none())

    # Campos de solo lectura (extraídos desde la relación con Programacion)
    usuario_nombre = serializers.SerializerMethodField()
    ficha = serializers.SerializerMethodField()

    class Meta:
        model = Reporte
        fields = [
            'id',
            'programacion',
            'usuario_nombre',
            'ficha',
            'entrada_usuario',
            'salida_usuario',
            'estado',
            'fecha_reporte'
        ]

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        user = self.context['request'].user
        if user.rol == 'admin':
            self.fields['programacion'].queryset = Programacion.objects.all()
        else:
            self.fields['programacion'].queryset = Programacion.objects.filter(usuario=user)

    def get_usuario_nombre(self, obj):
        return obj.programacion.usuario.get_full_name() or obj.programacion.usuario.username
    
    def get_ficha(self, obj):
        return FichaSerializer(obj.programacion.ficha).data