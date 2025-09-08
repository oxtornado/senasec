from rest_framework import viewsets
from .models import Equipo
from .serializers import EquipoSerializer
from permissions.permissions import IsInventoryUser

# ViewSet para el modelo Equipo
class EquipoViewSet(viewsets.ModelViewSet):
    queryset = Equipo.objects.all()  # Obtener todos los equipos
    serializer_class = EquipoSerializer  # Usar el serializador EquipoSerializer