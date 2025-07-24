from rest_framework import serializers
from .models import Programacion
from apps.asignaciones.models import Asignacion
from apps.aulas.models import Aula
from apps.users.models import Usuario
from apps.fichas.models import Ficha

class ProgramacionSerializer(serializers.ModelSerializer): # Serializador para el modelo Programacion
    usuario = serializers.PrimaryKeyRelatedField(queryset=Usuario.objects.all(), write_only=True) # Campo de escritura para el POST
    usuario_id = serializers.IntegerField(source='asignacion.usuario.id', read_only=True) # ID del usuario
    ficha = serializers.PrimaryKeyRelatedField(queryset=Ficha.objects.none()) # Mostrar el numero de la ficha
    aula = serializers.PrimaryKeyRelatedField(queryset=Aula.objects.all()) # Mostrar el aula
    asignacion = serializers.PrimaryKeyRelatedField(read_only=True)  # Mostrar la asignación creada
    
    class Meta:
        model = Programacion
        fields = ['id', 'usuario', 'usuario_id', 'ficha', 'asignacion', 'aula', 'dia', 'hora_inicio', 'hora_fin', 'ultima_actualizacion']  # Incluir todos los campos del modelo
        extra_kwargs = {
            'ultima_actualizacion': {'read_only': True},  # Para que la ultima actualizacion no sea visible en la API
        }

    def validate(self, data):
        """
        Validar que no haya conflictos de programación en la misma aula y hora.
        """
        if Programacion.objects.filter(
            aula=data['aula'],
            dia=data['dia'],
            hora_inicio__lt=data['hora_fin'],
            hora_fin__gt=data['hora_inicio']
        ).exists():
            raise serializers.ValidationError("Ya existe una programación en este aula y horario.")
        return data
    
    def create(self, validated_data):
        """
        Crear una programación con la asignación correspondiente.
        """
        usuario = validated_data.pop('usuario')
        ficha = validated_data.pop('ficha')

        # Buscar o crear la asignación correspondiente
        try:
            print("Buscando asignación...")  # Depuración
            asignacion = Asignacion.objects.get(usuario=usuario, ficha=ficha)
        except Asignacion.DoesNotExist:
            print("Asignación no encontrada.")
            raise serializers.ValidationError("La ficha seleccionada no está asignada al usuario.")

        # Crear la programación con la asignación encontrada
        programacion = Programacion.objects.create(asignacion=asignacion, ficha=ficha, **validated_data)
        return programacion
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        request = self.context.get('request')  # Obtener la solicitud del contexto
        if request and request.data.get('usuario'):  # Verificar si se envió un usuario
            try:
                usuario_id = int(request.data.get('usuario'))
                queryset = Ficha.objects.filter(asignaciones__usuario_id=usuario_id)
                print(f"Fichas disponibles para el usuario {usuario_id}: {queryset}")  # Depuración
                self.fields['ficha'].queryset = queryset
            except ValueError:
                print("Usuario no válido")  # Depuración
                self.fields['ficha'].queryset = Ficha.objects.none()  # Si el usuario no es válido, no mostrar fichas