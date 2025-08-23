from rest_framework.routers import DefaultRouter
from django.urls import path, include
from .views import ProgramacionViewSet

router = DefaultRouter()
router.register(r'programaciones', ProgramacionViewSet) # Registrar el ViewSet de Programacion en el router

urlpatterns = [
    path('', include(router.urls)),
]