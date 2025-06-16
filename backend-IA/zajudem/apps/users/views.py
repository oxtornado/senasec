from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework import generics, viewsets, permissions
from .models import Usuario
from .serializers import UsuarioSerializer, CustomTokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.exceptions import PermissionDenied
from permissions.permissions import IsAdminUser, IsOwnerOrAdmin  # Importa la clase IsAdminUser para verificar permisos de administrador


# Vista para Ver el Perfil del Usuario Autenticado
class ProfileView(APIView):  # Hereda de APIView para definir una vista más personalizada
    permission_classes = [permissions.IsAuthenticated]  # Solo usuarios autenticados pueden acceder

    def get(self, request):  # Define el método GET para obtener los datos del usuario autenticado
        """
         ¿Qué hace este método?
        - Obtiene el usuario autenticado (`request.user`).
        - Devuelve los datos del usuario en formato JSON.
        - Agrega un mensaje de bienvenida personalizado.
        """
        user = request.user  # Obtiene el usuario que está haciendo la solicitud
        return Response({  # Retorna un JSON con los datos del usuario
            "id": user.id,
            "message": f"¡Bienvenido, {user.username}!",  # Mensaje de bienvenida
            'username': user.username,
            'email': user.email,
            'telefono': user.telefono,
            'rol': user.rol
        })


class UsuarioCreateView(generics.CreateAPIView): # Vista para crear un usuario
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer
    permission_classes = [IsAdminUser]  # Solo los administradores pueden crear usuarios


class UsuarioViewSet(viewsets.ModelViewSet): # Vista para ver todos los usuarios
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer
    permission_classes = [IsOwnerOrAdmin]  # Solo los administradores pueden crear usuarios


class Login(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer


class LogoutView(APIView):
    def post(self, request):
        try:
            refresh_token = request.data["refresh"]
            token = RefreshToken(refresh_token)
            token.blacklist()  # Revocar el token
            return Response({"message": "Sesión cerrada correctamente."}, status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            return Response({"error": "No se pudo cerrar la sesión."}, status=status.HTTP_400_BAD_REQUEST)