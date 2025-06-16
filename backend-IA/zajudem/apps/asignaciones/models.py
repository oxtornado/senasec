from django.db import models
from apps.users.models import Usuario
from apps.fichas.models import Ficha

class Asignacion(models.Model):
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE, related_name='asignaciones')
    ficha = models.ManyToManyField(Ficha, related_name='asignaciones')
    ultima_actualizacion = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'Fichas de {self.usuario.username}'