from rest_framework.routers import DefaultRouter
from django.urls import path, include
from .views import FichaViewSet

router = DefaultRouter()
router.register(r'fichas', FichaViewSet) # Registrar el ViewSet de Ficha en el router

urlpatterns = [
    path('', include(router.urls)),
]
