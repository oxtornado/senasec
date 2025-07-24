from django.db import models
from apps.aulas.models import Aula # Importando el modelo Aula
from apps.fichas.models import Ficha # Importando el modelo Ficha
from apps.asignaciones.models import Asignacion # Importando el modelo Asignacion

class Programacion(models.Model): # Creando el modelo Programacion
    asignacion = models.ForeignKey(Asignacion, on_delete=models.CASCADE, related_name='programacion') # Relacionando Asignacion
    ficha = models.ForeignKey(Ficha, on_delete=models.CASCADE, related_name='programacion') # Relacionando Ficha
    aula = models.ForeignKey(Aula, on_delete=models.CASCADE, related_name='programacion') # Relacionando Aula
    dia = models.DateField() # Campo para la fecha
    hora_inicio = models.TimeField() # Campo para la hora de inicio
    hora_fin = models.TimeField() # Campo para la hora de fin
    ultima_actualizacion = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.asignacion.usuario.username} - {self.aula.aula} - {self.ficha.numero}" # Retornando el nombre del usuario, el aula y la ficha