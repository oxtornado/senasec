from rest_framework import serializers
from .models import Programacion
from apps.users.models import Usuario
from apps.ambiente.models import Ambiente
from apps.fichas.models import Ficha
from apps.users.serializers import UsuarioSerializer
from apps.ambiente.serializers import AmbienteSerializer
from apps.fichas.serializers import FichaSerializer

class ProgramacionSerializer(serializers.ModelSerializer): # Serializador para el modelo Programacion
    # Lectura (mostrar datos anidados)
    usuario = UsuarioSerializer(read_only=True)
    ambiente = AmbienteSerializer(read_only=True)
    ficha = FichaSerializer(read_only=True)

    # Escritura (aceptar IDs)
    usuario_id = serializers.PrimaryKeyRelatedField(queryset=Usuario.objects.all(), write_only=True)
    ambiente_id = serializers.PrimaryKeyRelatedField(queryset=Ambiente.objects.all(), write_only=True)
    ficha_id = serializers.PrimaryKeyRelatedField(queryset=Ficha.objects.all(), write_only=True)

    class Meta:
        model = Programacion
        fields = [
            'id',
            'usuario', 'usuario_id',
            'ambiente', 'ambiente_id',
            'ficha', 'ficha_id',
            'dia',
            'hora_inicio',
            'hora_fin'
        ]

    def create(self, validated_data):
        # Extraemos los objetos de los campos de escritura
        usuario = validated_data.pop('usuario_id')
        ambiente = validated_data.pop('ambiente_id')
        ficha = validated_data.pop('ficha_id')

        return Programacion.objects.create(
            usuario=usuario,
            ambiente=ambiente,
            ficha=ficha,
            **validated_data
        )
    
    def update(self, instance, validated_data):
        instance.usuario = validated_data.pop('usuario_id', instance.usuario)
        instance.ambiente = validated_data.pop('ambiente_id', instance.ambiente)
        instance.ficha = validated_data.pop('ficha_id', instance.ficha)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save()
        return instance
    

    def validate(self, data):
        """
        Validar que no haya conflictos de programación en el mismo ambiente y hora.
        """

        ambiente = data.get('ambiente_id') or self.instance.ambiente
        dia = data['dia']
        hora_inicio = data['hora_inicio']
        hora_fin = data['hora_fin']

        # Obtener la instancia si estamos actualizando
        instance_id = self.instance.id if self.instance else None

        conflictos = Programacion.objects.filter(
            ambiente=ambiente,
            dia=dia,
            hora_inicio__lt=hora_fin,
            hora_fin__gt=hora_inicio
        ).exclude(id=instance_id)  # Excluirse a sí misma si está editando

        if conflictos.exists():
            raise serializers.ValidationError("Ya existe una programación en este ambiente que se cruza con este horario.")
        
        return data