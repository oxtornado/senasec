from django.db import models
from apps.ambiente.models import Ambiente

# Modelo de equipos
class Equipo(models.Model):
    ESTADOS = [
        ('disponible', 'Disponible'),
        ('mantenimiento', 'Mantenimiento'),
        ('dañado', 'Dañado'),
    ]

    TIPO_EQUIPO = [
        ('computador', 'Computador'),
        ('televisor', 'Televisor'),
    ]

    numero_serie = models.CharField(max_length=20, unique=True, blank=False, null=False)  # Número de serie del equipo
    tipo = models.CharField(max_length=15, choices=TIPO_EQUIPO, default='computador')  # Tipo de equipo
    pulgadas = models.CharField(max_length=5, blank=False, null=False)  # Tamaño en pulgadas
    caracteristicas = models.TextField(blank=False, null=False)  # Características del equipo
    estado = models.CharField(max_length=15, choices=ESTADOS, default='disponible')  # Estado del equipo
    ultima_actualizacion = models.DateField(auto_now=True)  # Fecha de la última actualización del estado del equipo

    ambiente = models.ForeignKey(Ambiente, on_delete=models.CASCADE, null=False, blank=False, related_name='equipos')  # Relación con el modelo Ambiente

    def __str__(self):
        return f"{self.numero_serie} - {self.tipo}"  # Devuelve el número de serie y tipo del equipo como representación del objeto