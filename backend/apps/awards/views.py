from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from core.permissions import IsOwnerOrReadOnly
from .models import Award
from .serializers import AwardSerializer


class AwardViewSet(viewsets.ModelViewSet):
    serializer_class = AwardSerializer
    permission_classes = [IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly]
    search_fields = ['title', 'given_by']
    filterset_fields = ['year']

    def get_queryset(self):
        queryset = Award.objects.all()
        recipient = self.request.query_params.get('recipient')
        if recipient:
            queryset = queryset.filter(recipient__id=recipient)
        return queryset.distinct()

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)
