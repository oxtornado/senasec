from django.core.mail import send_mail
from django.conf import settings
from rest_framework import viewsets
from .models import Novedad
from .serializers import NovedadSerializer

# ViewSet para el modelo Novedad
class NovedadViewSet(viewsets.ModelViewSet):
    queryset = Novedad.objects.all()  # Obtener todas las novedades
    serializer_class = NovedadSerializer  # Usar el serializador NovedadSerializer

    def perform_create(self, serializer):
        # Guardar la novedad en la base de datos
        novedad = serializer.save()

        # Después de guardar, enviar el correo
        self.enviar_correo(novedad)

    def enviar_correo(self, novedad):
        subject = f"Novedad registrada: {novedad.id}"
        message = f"Nueva novedad registrada en el ambiente: \n\n{novedad.descripcion}"

        # Formato HTML para el correo
        html_message = f"""
        <html>
        <head><title>SENASEC - Novedad registrada</title></head>
        <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #E6E6E6; padding: 20px;">
            <div style="margin: auto; background-color: #ffffff; padding: 20px; border-radius: 8px;">
                <h3 style="text-align: center; color: #1271FF; font-size: 30px;">SENASEC</h3>
                <h2 style="text-align: center;">📢 Nueva Novedad</h2>
                <p><strong>Descripción:</strong> {novedad.descripcion}</p>
                <p style="text-align: center; margin-top: 40px;">
                    <img src="https://senasofiaplus.xyz/wp-content/uploads/2023/10/logo-del-sena-01.png" alt="Logo" width="80" />
                </p>
            </div>
        </body>
        </html>
        """

        send_mail(
            subject,
            message,
            settings.DEFAULT_FROM_EMAIL,
            ['zajudem.senasec@gmail.com'],
            fail_silently=False,
            html_message=html_message,
        )