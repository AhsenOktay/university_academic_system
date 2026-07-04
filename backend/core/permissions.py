from rest_framework.permissions import BasePermission, SAFE_METHODS


class IsSuperAdmin(BasePermission):
    """Sadece süper admin erişebilir."""
    def has_permission(self, request, view):
        return bool(
            request.user and
            request.user.is_authenticated and
            request.user.role == 'superadmin'
        )


class IsAcademicOrAdmin(BasePermission):
    """Akademisyen veya süper admin erişebilir."""
    def has_permission(self, request, view):
        return bool(
            request.user and
            request.user.is_authenticated and
            request.user.role in ('academic', 'superadmin')
        )


class IsOwnerOrReadOnly(BasePermission):
    """
    Okuma herkese açık.
    Yazma sadece nesnenin sahibine veya admin'e.
    """
    def has_object_permission(self, request, view, obj):
        if request.method in SAFE_METHODS:
            return True
        if request.user.role == 'superadmin':
            return True
        return getattr(obj, 'owner', None) == request.user


class IsOwnerOrAdmin(BasePermission):
    """Nesnenin sahibi veya admin erişebilir."""
    def has_object_permission(self, request, view, obj):
        if request.user.role == 'superadmin':
            return True
        return getattr(obj, 'owner', None) == request.user
