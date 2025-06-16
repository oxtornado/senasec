from django.db import models

# Modelo de aulas
class Aula(models.Model):
    # Definición de los campos del modelo
    aula = models.CharField(max_length=50, unique=True, blank=False, null=False)  # Nombre del aula
    capacidad = models.PositiveIntegerField(blank=False, null=False)  # Capacidad del aula

    def __str__(self):
        return f"Ambiente {self.aula} - Capacidad {self.capacidad}"  # Devuelve el nombre del aula y su capacidad como representación del objeto