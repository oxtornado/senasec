from random import randint
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework import generics, viewsets, permissions
from .models import Usuario
from .serializers import UsuarioSerializer, CustomTokenObtainPairSerializer, EmailVerificationRequestSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.exceptions import PermissionDenied
from permissions.permissions import IsAdminUser, IsOwnerOrAdmin  # Importa la clase IsAdminUser para verificar permisos de administrador
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.core.mail import send_mail
from django.contrib.auth import get_user_model
from django.utils import timezone
from .models import EmailVerificationCode
from .serializers import EmailVerificationRequestSerializer
from .utils import generate_code
from rest_framework.permissions import AllowAny

User = get_user_model()

class VerifyEmailCode(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        documento = request.data.get('documento')
        code = request.data.get('code')

        if not documento or not code:
            return Response({'error': 'Faltan campos'}, status=400)

        try:
            user = Usuario.objects.get(documento=documento)
        except Usuario.DoesNotExist:
            return Response({'error': 'Usuario no encontrado'}, status=404)

        try:
            verification = EmailVerificationCode.objects.filter(
                user=user, code=code, used=False
            ).latest('created_at')
        except EmailVerificationCode.DoesNotExist:
            return Response({'error': 'Código inválido'}, status=400)

        if verification.is_expired():
            return Response({'error': 'Código expirado'}, status=400)

        user.is_active = True
        user.save()

        verification.used = True
        verification.save()

        return Response({'message': 'Cuenta verificada'}, status=200)

class VerificationEmail(APIView):
    def post(self, request):
        serializer = EmailVerificationRequestSerializer(data=request.data)
        if not serializer.is_valid():
            return Response({'error': 'Invalid input.'}, status=status.HTTP_400_BAD_REQUEST)

        document = serializer.validated_data['document']
        try:
            user = User.objects.get(document=document)
        except User.DoesNotExist:
            return Response({'error': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)

        # Generate and store the code
        code = generate_code()
        EmailVerificationCode.objects.create(user=user, code=code)

        # Send email
        send_mail(
            subject='Your Verification Code',
            message=f'Your verification code is: {code}',
            from_email='no-reply@yourapp.com',
            recipient_list=[user.email],
            fail_silently=False
        )

        return Response({'message': 'Verification code sent.'}, status=status.HTTP_200_OK)
    
class BuscarUsuarioPorDocumento(APIView):
    """
    Vista POST para buscar un usuario por número de documento.
    """
    def post(self, request):
        documento = request.data.get("documento")

        if not documento:
            return Response({"error": "El campo 'documento' es requerido."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            usuario = Usuario.objects.get(documento=documento)
        except Usuario.DoesNotExist:
            return Response({"error": "Usuario no encontrado."}, status=status.HTTP_404_NOT_FOUND)

        serializer = UsuarioSerializer(usuario)
        return Response(serializer.data, status=status.HTTP_200_OK)


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


class UsuarioCreateView(generics.CreateAPIView):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer
    permission_classes = [AllowAny]

    def verify_email_code(self, email, documento, code):
        """Verify that the email has been verified with the given code."""
        try:
            verification = EmailVerificationCode.objects.get(
                email=email,
                documento=documento,
                code=code,
                verified=True,
                created_at__gte=timezone.now() - timezone.timedelta(minutes=15)
            )
            return True
        except EmailVerificationCode.DoesNotExist:
            return False

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        # Extract verification data
        email = request.data.get('email')
        documento = request.data.get('documento')
        verification_code = request.data.get('verificationCode')
        
        # Verify the email was verified
        if not self.verify_email_code(email, documento, verification_code):
            return Response(
                {'error': 'Por favor verifica tu correo electrónico primero'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            # Create the user
            user = serializer.save(is_active=True)  # User is active after verification
            return Response(serializer.data, status=status.HTTP_201_CREATED)
            
        except Exception as e:
            print("Registration error:", str(e))
            return Response(
                {'error': 'Error al crear el usuario'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


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