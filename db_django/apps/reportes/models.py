from django.db import models
from apps.programacion.models import Programacion # Importando el modelo Programacion

class Reporte(models.Model): # Creando el modelo Programacion
    programacion = models.OneToOneField(Programacion, on_delete=models.CASCADE, related_name='reportes') # Relacionando Programacion
    novedades = models.CharField(max_length=255) # Campo para las novedades
    entrada_usuario = models.TimeField() # Campo para la hora de inicio
    salida_usuario = models.TimeField() # Campo para la hora de fin
    fecha_reporte = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Reporte de {self.programacion.usuario.username} - {self.fecha_reporte}" # Retornando el nombre del usuario, el aula y la ficha