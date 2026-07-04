from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from core.permissions import IsOwnerOrReadOnly
from .models import Thesis
from .serializers import ThesisSerializer


class ThesisViewSet(viewsets.ModelViewSet):
    serializer_class = ThesisSerializer
    permission_classes = [IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly]
    search_fields = ['title', 'student__first_name', 'advisor__first_name']
    filterset_fields = ['thesis_type', 'year']

    def get_queryset(self):
        queryset = Thesis.objects.all()
        advisor = self.request.query_params.get('advisor')
        if advisor:
            queryset = queryset.filter(advisor__id=advisor)
        return queryset.distinct()

    def perform_create(self, serializer):
     serializer.save(owner=self.request.user, advisor=self.request.user)
