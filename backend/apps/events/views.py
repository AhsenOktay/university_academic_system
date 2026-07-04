from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from core.permissions import IsOwnerOrReadOnly
from .models import Event
from .serializers import EventSerializer


class EventViewSet(viewsets.ModelViewSet):
    serializer_class = EventSerializer
    permission_classes = [IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly]
    filterset_fields = ['event_type', 'role']
    search_fields = ['title', 'location']

    def get_queryset(self):
        queryset = Event.objects.all()
        organizer = self.request.query_params.get('organizer')
        if organizer:
            queryset = queryset.filter(organizer__id=organizer)
        return queryset.distinct()

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user, organizer=self.request.user)