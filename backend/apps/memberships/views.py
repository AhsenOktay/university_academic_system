from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from core.permissions import IsOwnerOrReadOnly
from .models import Membership
from .serializers import MembershipSerializer


class MembershipViewSet(viewsets.ModelViewSet):
    serializer_class = MembershipSerializer
    permission_classes = [IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly]
    filterset_fields = ['membership_type', 'is_active']
    search_fields = ['organization', 'role']

    def get_queryset(self):
        queryset = Membership.objects.all()
        member = self.request.query_params.get('member')
        if member:
            queryset = queryset.filter(member__id=member)
        return queryset.distinct()

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user, member=self.request.user)