from rest_framework import viewsets
from .models import Programacion  # Importando el modelo Programacion
from .serializers import ProgramacionSerializer  # Importando el serializador ProgramacionSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import PermissionDenied

# ViewSet para el modelo Programacion
class ProgramacionViewSet(viewsets.ModelViewSet):
    queryset = Programacion.objects.all()  # Obtener todas las Programacion
    serializer_class = ProgramacionSerializer  # Usar el serializador ProgramacionSerializer
    permission_classes = [IsAuthenticated]  # Requiere autenticación y ser propietario

    def get_queryset(self):
        # Verificar si el usuario está autenticado
        if self.request.user.is_authenticated:
            # Si el usuario es administrador, devolver todas las programaciones
            if self.request.user.rol == 'admin':  # Asegúrate de que el campo 'rol' exista en el modelo de usuario
                return Programacion.objects.all()
            # Si no es administrador, devolver solo las programaciones del usuario logueado
            return Programacion.objects.filter(asignacion__usuario=self.request.user)
        # Si el usuario no está autenticado, devolver un queryset vacío
        raise PermissionDenied(detail="Debe iniciar sesión para ver sus programaciones.")