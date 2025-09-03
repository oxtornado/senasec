from rest_framework.permissions import BasePermission # esto es para crear permisos personalizados
from rest_framework.exceptions import PermissionDenied

class IsAdminUser(BasePermission):
    """Permiso personalizado para permitir solo a administradores acceder."""
    
    def has_permission(self, request, view):
        # se generan 2 condiciones conde si el usuario no esta autentificado no podra ingresar
        if not request.user.is_authenticated:
            # permision es un excepcion que se lanza cuando para enviar un mcodigo de error 403
            # en este caso se envia un mensaje de error perzonalizados 
            raise PermissionDenied(detail="Debe iniciar sesión para acceder a esta área.")

        if request.user.rol != 'admin':
             # porque no retur porque lo maneja de forma generica 
            # en cambio raise es para lanzar una excepcion a nuestra respuesta 403
            raise PermissionDenied(detail="No tiene permitido el acceso a esta área.")

        return True  # Permite el acceso solo si es admin
    

class IsInventoryUser(BasePermission):
    """Permiso personalizado para permitir solo a administradores o inventario acceder."""
    
    def has_permission(self, request, view):
        # se generan 2 condiciones conde si el usuario no esta autentificado no podra ingresar
        if not request.user.is_authenticated:
            # permision es un excepcion que se lanza cuando para enviar un mcodigo de error 403
            # en este caso se envia un mensaje de error perzonalizados 
            raise PermissionDenied(detail="Debe iniciar sesión para acceder a esta área.")

        if request.user.rol not in ['admin', 'inventario']:
             # porque no retur porque lo maneja de forma generica 
            # en cambio raise es para lanzar una excepcion a nuestra respuesta 403
            raise PermissionDenied(detail="No tiene permitido el acceso a esta área.")

        return True  # Permite el acceso solo si es admin o jefe de inventario
    

class IsOwnerOrAdmin(BasePermission):
    """Permiso personalizado para permitir acceso solo a las programaciones del usuario logueado."""

    def has_object_permission(self, request, view, obj):

        return request.user.rol == 'admin' or obj == request.user