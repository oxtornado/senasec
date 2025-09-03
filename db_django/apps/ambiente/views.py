from rest_framework import viewsets
from .models import Ambiente
from .serializers import AmbienteSerializer
from rest_framework.permissions import IsAuthenticated  # Importando permisos de autenticación
from rest_framework.exceptions import PermissionDenied


# Vista para lista el ambiente con crud personalizado para administradores y usuarios
class AmbienteViewSet(viewsets.ModelViewSet):
    queryset = Ambiente.objects.all()
    serializer_class = AmbienteSerializer
    permission_classes = [IsAuthenticated]
    
    def update(self, request, *args, **kwargs):
        if request.user.rol not in ['admin', 'inventario']:
            raise PermissionDenied("Solo los administradores pueden actualizar ambientes.")
        return super().update(request, *args, **kwargs)
    
    def destroy(self, request, *args, **kwargs):
        if request.user.rol not in ['admin', 'inventario']:
            raise PermissionDenied("Solo los administradores pueden eliminar ambientes.")
        return super().destroy(request, *args, **kwargs)