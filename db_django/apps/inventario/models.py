from django.db import models
from apps.aulas.models import Aula # Importando el modelo Aula

class Inventario(models.Model): # Creando el modelo Inventario
    aula = models.OneToOneField(Aula, on_delete=models.CASCADE, related_name='inventario') # Relacionando Aula
    computadores = models.PositiveIntegerField(default=0)
    mouses = models.PositiveIntegerField(default=0)
    teclados = models.PositiveIntegerField(default=0)
    tablets = models.PositiveIntegerField(default=0)
    televisores = models.PositiveIntegerField(default=0)
    proyectores = models.PositiveIntegerField(default=0)
    ultima_actualizacion = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.aula.aula} - {self.ultima_actualizacion}" # Retornando el nombre del aula y la fecha de la ultima actualizacion