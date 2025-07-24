from rest_framework import viewsets
from .models import Inventario  # Importando el modelo Inventario
from .serializers import InventarioSerializer  # Importando el serializador InventarioSerializer
from permissions.permissions import IsAdminUser

# ViewSet para el modelo Ficha
class InventarioViewSet(viewsets.ModelViewSet):
    queryset = Inventario.objects.all()  # Obtener todas las Inventario
    serializer_class = InventarioSerializer  # Usar el serializador InventarioSerializer
    #permission_classes = [IsAdminUser] # Solo los usuarios administradores pueden acceder a esta vista