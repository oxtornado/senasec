from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import PermissionDenied
from .models import Reporte
from .serializers import ReporteSerializer

class ReporteViewSet(viewsets.ModelViewSet):
    queryset = Reporte.objects.all()
    serializer_class = ReporteSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.rol == 'admin':
            return Reporte.objects.all()
        return Reporte.objects.filter(programacion__usuario=user)

    def perform_create(self, serializer):
        programacion = serializer.validated_data['programacion']
        if programacion.usuario != self.request.user and self.request.user.rol != 'admin':
            raise PermissionDenied("No puedes crear un reporte para una programación que no es tuya.")
        serializer.save()

    def perform_update(self, serializer):
        programacion = serializer.validated_data.get('programacion', serializer.instance.programacion)
        if programacion.usuario != self.request.user and self.request.user.rol != 'admin':
            raise PermissionDenied("No puedes modificar este reporte.")
        serializer.save()

    def perform_destroy(self, instance):
        # Si no es admin y la programación no es suya
        if instance.programacion.usuario != self.request.user and self.request.user.rol != 'admin':
            raise PermissionDenied("No puedes eliminar un reporte que no es tuyo.")
        instance.delete()