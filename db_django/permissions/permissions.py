from rest_framework.permissions import BasePermission
from rest_framework.exceptions import PermissionDenied

class IsAdminUser(BasePermission):
    """Permiso personalizado para permitir solo a administradores acceder."""

    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            raise PermissionDenied(detail="Debe iniciar sesión para acceder a esta área.")

        if request.user.rol != 'admin':
            raise PermissionDenied(detail="No tiene permitido el acceso a esta área.")

        return True


class IsOwnerOrAdmin(BasePermission):
    """Permiso personalizado para permitir acceso solo al dueño del objeto o a administradores."""

    def has_object_permission(self, request, view, obj):
        user = request.user

        if not user.is_authenticated:
            return False  

        return user.rol == 'admin' or obj == user
