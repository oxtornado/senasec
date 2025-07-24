from rest_framework import viewsets
from .models import Aula
from .serializers import AulaSerializer
from permissions.permissions import IsAdminUser

# ViewSet para el modelo Ficha
class AulaViewSet(viewsets.ModelViewSet):
    queryset = Aula.objects.all()  # Obtener todas las Aulas
    serializer_class = AulaSerializer  # Usar el serializador AulaSerializer
    permission_classes = [IsAdminUser] # Solo administradores pueden acceder a esta vista