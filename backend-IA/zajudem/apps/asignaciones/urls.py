from rest_framework.routers import DefaultRouter
from django.urls import path, include
from .views import AsignacionViewSet

router = DefaultRouter()
router.register(r'asignaciones', AsignacionViewSet) # Registrar el ViewSet de Ficha en el router

urlpatterns = [
    path('', include(router.urls)),
]