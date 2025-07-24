from rest_framework import viewsets
from .models import Reporte  # Importando el modelo Reporte
from .serializers import ReporteSerializer  # Importando el serializador ReporteSerializer

# ViewSet para el modelo Reportes
class ReporteViewSet(viewsets.ModelViewSet):
    queryset = Reporte.objects.all()  # Obtener todos los Reportes
    serializer_class = ReporteSerializer  # Usar el serializador ReporteSerializer