from rest_framework.routers import DefaultRouter
from django.urls import path, include
from .views import NovedadViewSet

router = DefaultRouter()
router.register(r'novedades', NovedadViewSet) # Registrar el ViewSet de Novedad en el router

urlpatterns = [
    path('', include(router.urls)),
]