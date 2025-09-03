from django.db import models

# Modelo de ambiente
class Ambiente(models.Model):
    ESTADOS = [
        ('disponible', 'Disponible'),
        ('mantenimiento', 'Mantenimiento'),
        ('en uso', 'En uso'),
        ('dañado', 'Dañado'),
    ]

    nombre = models.CharField(max_length=20, unique=True, blank=False, null=False)  # Nombre del ambiente
    estado = models.CharField(max_length=15, choices=ESTADOS, default='disponible')  # Estado del ambiente
    ultima_actualizacion = models.DateField(auto_now=True)  # Fecha de la última actualización del estado del ambiente

    def __str__(self):
        return f"{self.nombre}"  # Devuelve el nombre del ambiente