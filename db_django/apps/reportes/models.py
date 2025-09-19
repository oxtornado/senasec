from django.db import models
from apps.programaciones.models import Programacion # Importando el modelo Programacion

class Reporte(models.Model): # Creando el modelo Programacion
    ESTADOS = [
        ('completo', 'Completo'),
        ('revisado', 'Revisado'),
        ('pendiente', 'Pendiente'),
    ]

    programacion = models.OneToOneField(Programacion, on_delete=models.CASCADE, related_name='reporte') # Relacionando Programacion
    entrada_usuario = models.TimeField() # Campo para la hora de inicio
    salida_usuario = models.TimeField() # Campo para la hora de fin
    estado = models.CharField(max_length=15, choices=ESTADOS, default='pendiente')  # Estado de la ficha
    fecha_reporte = models.DateField(auto_now=True)

    def __str__(self):
        return f"Reporte de {self.programacion.usuario.username} - {self.fecha_reporte}" # Retornando el nombre del usuario y la fecha de reporte