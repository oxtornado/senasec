from rest_framework.routers import DefaultRouter
from django.urls import path, include
from .views import EquipoViewSet

router = DefaultRouter()
router.register(r'equipos', EquipoViewSet) # Registrar el ViewSet de Equipo en el router

urlpatterns = [
    path('', include(router.urls)),
]