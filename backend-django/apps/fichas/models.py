from django.db import models

# Modelo de fichas
class Ficha(models.Model):
    JORNADAS = [
        ('diurna', 'Diurna'),
        ('tarde', 'Tarde'),
        ('nocturna', 'Nocturna'),
        ('mixta', 'Mixta'),  
    ]
    # Definición de los campos del modelo
    programa = models.CharField(max_length=70, blank=False, null=False)  # Nombre del programa
    numero = models.CharField(max_length=8, unique=True, blank=False, null=False)  # Numero de la ficha
    jornada = models.CharField(max_length=15, choices=JORNADAS, default='diurna')
    capacidad = models.PositiveIntegerField(blank=False, null=False)  # Numero de aprendices por ficha

    def __str__(self):
        return f"{self.numero} - {self.jornada}" # Devuelve el número de la ficha como representación del objeto
