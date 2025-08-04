from django.contrib.auth.models import AbstractUser
from django.db import models
from django.conf import settings
from django.utils import timezone
class Usuario(AbstractUser):
    # Definición de las opciones de rol
    ROL_CHOICES = [
        ('admin', 'Administrador'),
        ('instructor', 'Instructor'),
        ('seguridad', 'Guardia'),
        ('aseo', 'Limpieza'),
    ]
    
    # Campo para almacenar el rol del usuario
    rol = models.CharField(max_length=20, choices=ROL_CHOICES, default='instructor') # user por default

    # Campo de documento de identidad único
    documento = models.CharField(max_length=20, unique=True) # Documento de identidad único

    # Campo de correo electrónico único
    email = models.EmailField(null=True)
    
    # Campo de número de celular único
    telefono = models.CharField(max_length=15, blank=True, null=True)

    # Campo de estado de usuario
    is_active = models.BooleanField(default=False)

    # Campo de fecha de registro
    fecha_registro = models.DateTimeField(auto_now=True) # Fecha de registro automática

    # Campo del face_token
    face_token = models.CharField(max_length=255, blank=False, null=True)

    USERNAME_FIELD = 'documento'  # Define el campo que se usará para iniciar sesión
    REQUIRED_FIELDS = ['username']  # Campos requeridos al crear un usuario

    def __str__(self):
        return f"{self.username} - {self.documento}"

class EmailVerificationCode(models.Model):
    email = models.EmailField()
    documento = models.CharField(max_length=20)
    code = models.CharField(max_length=6)
    created_at = models.DateTimeField(auto_now_add=True)
    used = models.BooleanField(default=False)
    verified = models.BooleanField(default=False)

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['email', 'documento', 'code']),
        ]

    def is_expired(self):
        # Codes expire after 15 minutes
        return timezone.now() > self.created_at + timezone.timedelta(minutes=15)
        
    def mark_used(self):
        self.used = True
        self.save()
        
    def mark_verified(self):
        self.verified = True
        self.used = True
        self.save()
        
    @classmethod
    def get_valid_code(cls, email, documento, code):
        try:
            return cls.objects.get(
                email=email,
                documento=documento,
                code=code,
                used=False,
                created_at__gte=timezone.now() - timezone.timedelta(minutes=15)
            )
        except cls.DoesNotExist:
            return None
