from django.db import models

# Modelo de fichas
class Ficha(models.Model):
    ESTADOS = [
        ('activa', 'Activa'),
        ('inactiva', 'Inactiva'),
    ]

    JORNADAS = [
        ('diurna', 'Diurna'),
        ('tarde', 'Tarde'),
        ('nocturna', 'Nocturna'),
        ('mixta', 'Mixta'),  
    ]
    # Definición de los campos del modelo
    numero = models.CharField(max_length=8, unique=True, blank=False, null=False)  # Numero de la ficha
    jornada = models.CharField(max_length=15, choices=JORNADAS, default='diurna')
    capacidad = models.PositiveIntegerField(blank=False, null=False)  # Numero de aprendices por ficha
    estado = models.CharField(max_length=10, choices=ESTADOS, default='activa')  # Estado de la ficha

    def __str__(self):
        return f"{self.numero} - {self.jornada}" # Devuelve el número de la ficha como representación del objeto
