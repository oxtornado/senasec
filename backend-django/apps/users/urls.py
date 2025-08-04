from rest_framework.routers import DefaultRouter
from django.urls import path, include
from .views import UsuarioCreateView, UsuarioViewSet, ProfileView, BuscarUsuarioPorDocumento
from .verification import SendVerificationCodeView, VerifyCodeView

router = DefaultRouter()
router.register(r'usuarios', UsuarioViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('registrar/', UsuarioCreateView.as_view(), name='registrar-usuario'),
    path('buscar-por-documento/', BuscarUsuarioPorDocumento.as_view(), name='buscar_usuario_documento'),
    path('profile/', ProfileView.as_view(), name='profile'),
    
    # Email verification endpoints
    path('verify-email-code/', SendVerificationCodeView.as_view(), name='send-verification-code'),
    path('verify-code/', VerifyCodeView.as_view(), name='verify-code'),
]