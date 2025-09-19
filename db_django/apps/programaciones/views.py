from rest_framework import viewsets
from .models import Programacion  # Importando el modelo Programacion
from .serializers import ProgramacionSerializer  # Importando el serializador ProgramacionSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import PermissionDenied
from permissions.permissions import IsAdminUser  # Importando permisos personalizados
from rest_framework.response import Response
from rest_framework.decorators import action


# ViewSet para el modelo Programacion
class ProgramacionViewSet(viewsets.ModelViewSet):
    queryset = Programacion.objects.all()  # Obtener todas las Programacion
    serializer_class = ProgramacionSerializer  # Usar el serializador ProgramacionSerializer
    permission_classes = [IsAuthenticated]  # Requiere autenticación y ser propietario

    @action(detail=False, methods=['get'], url_path='mias')
    def mis_programaciones(self, request):
        user = request.user

        # Si es administrador, devuelve todas
        if user.rol == 'admin':
            programaciones = Programacion.objects.all()
        else:
            # Si es usuario común, solo las suyas
            programaciones = Programacion.objects.filter(usuario=user)

        serializer = self.get_serializer(programaciones, many=True)
        return Response(serializer.data)
    
    def create(self, request, *args, **kwargs):
        if request.user.rol != 'admin':
            raise PermissionDenied(detail="Solo los administradores pueden crear programaciones.")
        return super().create(request, *args, **kwargs)
    
    def update(self, request, *args, **kwargs):
        if request.user.rol != 'admin':
            raise PermissionDenied("Solo los administradores pueden modificar programaciones.")
        return super().update(request, *args, **kwargs)
    
    def destroy(self, request, *args, **kwargs):
        if request.user.rol != 'admin':
            raise PermissionDenied("Solo los administradores pueden eliminar programaciones.")
        return super().destroy(request, *args, **kwargs)