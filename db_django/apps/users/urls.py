from rest_framework.routers import DefaultRouter
from django.urls import path, include
from .views import *

router = DefaultRouter()
router.register(r'usuarios', UsuarioViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('registrar/', UsuarioCreateView.as_view(), name='registrar-usuario'), # Este es el path para registrar un nuevo usuario
    path('profile/', ProfileView.as_view(), name='profile'), # Este es el path para ver los datos del perfil
    path('api/get-face-token/', get_face_token),
    path('api/get-face-token-by-password/', get_face_token_by_password, name='get_face_token_by_password'),
    path('update-face-token/', update_face_token),  # Path para actualizar el face_token
    path('reset-password/', reset_password, name='reset-password'),  # 👈 add this
    path('usuarios-list/', UsuarioListView.as_view(), name='usuarios-list'),
]