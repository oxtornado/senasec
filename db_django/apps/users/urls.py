from rest_framework.routers import DefaultRouter
from django.urls import path, include
from .views import (
    UsuarioCreateView,
    UsuarioViewSet,
    ProfileView,
    get_face_token,
    update_face_token,
    get_face_token_by_password,
)
router = DefaultRouter()
router.register(r'usuarios', UsuarioViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('registrar/', UsuarioCreateView.as_view(), name='registrar-usuario'),
    path('profile/', ProfileView.as_view(), name='profile'),
    path('api/get-face-token/', get_face_token),
    path('api/get-face-token-by-password/', get_face_token_by_password, name='get_face_token_by_password'),
    path('update-face-token/', update_face_token),
]

