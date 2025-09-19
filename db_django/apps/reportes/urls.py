from rest_framework.routers import DefaultRouter
from django.urls import path, include
from .views import ReporteViewSet # Importando el ViewSet de Reporte

router = DefaultRouter()
router.register(r'reportes', ReporteViewSet) # Registrar el ViewSet de Reporte en el router

urlpatterns = [
    path('', include(router.urls)),
]