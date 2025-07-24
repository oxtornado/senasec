from rest_framework.routers import DefaultRouter
from django.urls import path, include
from .views import InventarioViewSet

router = DefaultRouter()
router.register(r'inventarios', InventarioViewSet) # Registrar el ViewSet de Inventario en el router

urlpatterns = [
    path('', include(router.urls)),
]