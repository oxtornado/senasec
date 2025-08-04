import random
import string
from datetime import timedelta
from django.utils import timezone
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from django.core.mail import send_mail
from django.conf import settings
from .models import EmailVerificationCode, Usuario

class SendVerificationCodeView(APIView):
    permission_classes = [AllowAny]
    
    def generate_code(self):
        """Generate a 6-digit verification code."""
        return ''.join(random.choices(string.digits, k=6))
    
    def post(self, request):
        print("\n=== DEBUG: SendVerificationCodeView called ===")
        print(f"Request data: {request.data}")
        
        email = request.data.get('email')
        documento = request.data.get('documento')  # Updated to match frontend
        
        print(f"Email: {email}, Documento: {documento}")
        
        if not email or not documento:
            error_msg = 'Email y documento son requeridos'
            print(f"ERROR: {error_msg}")
            return Response(
                {'error': error_msg}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Verify user exists with this documento and email
        try:
            user = Usuario.objects.get(documento=documento, email=email)
            print(f"User found: {user.username}")
        except Usuario.DoesNotExist:
            error_msg = 'Usuario no encontrado con este documento y correo'
            print(f"ERROR: {error_msg}")
            return Response(
                {'error': error_msg},
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Invalidate previous codes for this email/documento
        print("Invalidating previous codes...")
        EmailVerificationCode.objects.filter(
            email=email,
            documento=documento,
            used=False
        ).update(used=True)
        
        # Generate and save new code
        code = self.generate_code()
        print(f"Generated new code: {code}")
        
        verification = EmailVerificationCode.objects.create(
            email=email,
            documento=documento,
            code=code
        )
        
        # Send email with verification code
        try:
            print(f"Sending email to: {email}")
            print(f"Using email backend: {settings.EMAIL_BACKEND}")
            print(f"From email: {getattr(settings, 'DEFAULT_FROM_EMAIL', settings.EMAIL_HOST_USER)}")
            print(f"Email host: {settings.EMAIL_HOST}")
            print(f"Email port: {settings.EMAIL_PORT}")
            print(f"Email TLS: {settings.EMAIL_USE_TLS}")
            
            # Always try to send email, regardless of DEBUG mode
            subject = 'SENASEC - Código de verificación'
            message = f"""
¡Hola!

Tu código de verificación para SENASEC es: {code}

Este código expirará en 15 minutos por seguridad.

Si no solicitaste este código, puedes ignorar este mensaje.

Saludos,
Equipo SENASEC
            """
            
            # Use EMAIL_HOST_USER as the from_email if DEFAULT_FROM_EMAIL is not set
            from_email = getattr(settings, 'DEFAULT_FROM_EMAIL', settings.EMAIL_HOST_USER)
            
            send_mail(
                subject=subject,
                message=message,
                from_email=from_email,
                recipient_list=[email],
                fail_silently=False,
            )
            
            success_msg = 'Código de verificación enviado correctamente'
            print("Email sent successfully")
            
            # In DEBUG mode, also log the code for easier testing
            if settings.DEBUG:
                print(f"DEBUG: Verification code for {email} is {code}")
            
        except Exception as e:
            error_msg = f'Error al enviar el correo de verificación: {str(e)}'
            print(f"ERROR: {error_msg}")
            print(f"Exception type: {type(e).__name__}")
            print(f"Exception details: {e}")
            
            # Don't delete the verification code, just return error
            # This way we can still use the code for testing if email fails
            if settings.DEBUG:
                print(f"DEBUG: Email failed but code {code} is still valid for testing")
                return Response(
                    {
                        'message': f'Código generado pero email falló: {code}',
                        'error': 'Error al enviar email'
                    },
                    status=status.HTTP_207_MULTI_STATUS  # Partial success
                )
            else:
                verification.delete()
                return Response(
                    {'error': 'Error al enviar el correo de verificación'},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
        
        print(f"SUCCESS: {success_msg}")
        return Response(
            {'message': success_msg},
            status=status.HTTP_200_OK
        )


class VerifyCodeView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        print("\n=== DEBUG: VerifyCodeView called ===")
        print(f"Request data: {request.data}")
        
        email = request.data.get('email')
        documento = request.data.get('documento')
        code = request.data.get('code')
        
        print(f"Email: {email}, Documento: {documento}, Code: {code}")
        
        if not all([email, documento, code]):
            error_msg = 'Email, documento y código son requeridos'
            print(f"ERROR: {error_msg}")
            return Response(
                {'error': error_msg},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Verify user exists with this documento and email
        try:
            user = Usuario.objects.get(documento=documento, email=email)
            print(f"User found: {user.username}")
        except Usuario.DoesNotExist:
            error_msg = 'Usuario no encontrado con este documento y correo'
            print(f"ERROR: {error_msg}")
            return Response(
                {'error': error_msg},
                status=status.HTTP_404_NOT_FOUND
            )
        
        print("Checking verification code...")
        verification = EmailVerificationCode.get_valid_code(email, documento, code)
        
        if not verification:
            error_msg = 'Código inválido o expirado'
            print(f"ERROR: {error_msg}")
            return Response(
                {'error': error_msg},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Mark the code as verified
        print("Marking code as verified...")
        verification.mark_verified()
        
        success_msg = 'Código verificado correctamente'
        print(f"SUCCESS: {success_msg}")
        return Response(
            {
                'message': success_msg,
                'user_id': user.id,
                'username': user.username
            },
            status=status.HTTP_200_OK
        )