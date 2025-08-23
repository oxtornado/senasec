from rest_framework.routers import DefaultRouter
from django.urls import path, include
from .views import AmbienteViewSet

router = DefaultRouter()
router.register(r'ambiente', AmbienteViewSet) # Registrar el ViewSet de Ambiente en el router

urlpatterns = [
    path('', include(router.urls)),
]