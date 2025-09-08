from rest_framework import viewsets
from .models import Novedad
from .serializers import NovedadSerializer
from permissions.permissions import IsInventoryUser

# ViewSet para el modelo Novedad
class NovedadViewSet(viewsets.ModelViewSet):
    queryset = Novedad.objects.all()  # Obtener todas las novedades
    serializer_class = NovedadSerializer  # Usar el serializador NovedadSerializer