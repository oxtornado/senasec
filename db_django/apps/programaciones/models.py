from django.db import models
from apps.users.models import Usuario # Importando el modelo Usuario
from apps.ambiente.models import Ambiente # Importando el modelo Ambiente
from apps.fichas.models import Ficha # Importando el modelo Ficha

class Programacion(models.Model): # Creando el modelo Programacion
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE, related_name='programacion') # Relacionando Usuario
    ambiente = models.ForeignKey(Ambiente, on_delete=models.CASCADE, related_name='programacion') # Relacionando Ambiente
    ficha = models.ForeignKey(Ficha, on_delete=models.CASCADE, related_name='programacion') # Relacionando Ficha
    dia = models.DateField() # Campo para la fecha
    hora_inicio = models.TimeField() # Campo para la hora de inicio
    hora_fin = models.TimeField() # Campo para la hora de fin
    ultima_actualizacion = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.usuario.username} - {self.ambiente.nombre} - {self.ficha.numero}" # Retornando el nombre del usuario, el ambiente y la ficha