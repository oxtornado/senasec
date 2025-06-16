from rest_framework.routers import DefaultRouter
from django.urls import path, include
from .views import AulaViewSet

router = DefaultRouter()
router.register(r'aulas', AulaViewSet) # Registrar el ViewSet de Aula en el router

urlpatterns = [
    path('', include(router.urls)),
]