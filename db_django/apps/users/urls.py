from rest_framework.routers import DefaultRouter
from django.urls import path, include
from .views import UsuarioCreateView, UsuarioViewSet, ProfileView, get_face_token, update_face_token

router = DefaultRouter()
router.register(r'usuarios', UsuarioViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('registrar/', UsuarioCreateView.as_view(), name='registrar-usuario'), # Este es el path para registrar un nuevo usuario
    path('profile/', ProfileView.as_view(), name='profile'), # Este es el path para ver los datos del perfil
    path('api/get-face-token/', get_face_token),
    path('update-face-token/', update_face_token),  # Path para actualizar el face_token
]
