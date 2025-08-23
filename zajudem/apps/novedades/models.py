from django.db import models
from apps.ambiente.models import Ambiente

# Modelo de novedades
class Novedad(models.Model):

    descripcion = models.TextField(blank=False, null=False)  # Descripción de la novedad
    ultima_actualizacion = models.DateField(auto_now=True)  # Fecha de la última actualización del estado del equipo

    ambiente = models.ForeignKey(Ambiente, on_delete=models.CASCADE, null=False, blank=False, related_name='novedades')  # Relación con el modelo Ambiente

    def __str__(self):
        return f"Novedad: {self.descripcion[:50]}"  # Devuelve una representación corta de la descripción de la novedad
