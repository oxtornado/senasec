from rest_framework import viewsets
from .models import Asignacion  # Importando el modelo Asignacion
from .serializers import AsignacionSerializer  # Importando el serializador AsignacionSerializer
from rest_framework.permissions import IsAuthenticated  # Importando permisos de autenticación
from rest_framework.exceptions import PermissionDenied

class AsignacionViewSet(viewsets.ModelViewSet):
    queryset = Asignacion.objects.all()
    serializer_class = AsignacionSerializer
    #permission_classes = [IsAuthenticated]

    #def get_queryset(self):
        # Verificar si el usuario está autenticado
        #if self.request.user.is_authenticated:
            # Si el usuario es administrador, devolver todas las programaciones
            #if self.request.user.rol == 'admin':  # Asegúrate de que el campo 'rol' exista en el modelo de usuario
                #return Asignacion.objects.all()
            # Si no es administrador, devolver solo las programaciones del usuario logueado
            #return Asignacion.objects.filter(usuario=self.request.user)
        # Si el usuario no está autenticado, devolver un queryset vacío
        #raise PermissionDenied(detail="Debe iniciar sesión para acceder a esta área.")
