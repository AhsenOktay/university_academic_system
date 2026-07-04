from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from core.permissions import IsOwnerOrReadOnly
from .models import Patent
from .serializers import PatentSerializer


class PatentViewSet(viewsets.ModelViewSet):
    serializer_class = PatentSerializer
    permission_classes = [IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly]
    search_fields = ['title', 'patent_no']
    filterset_fields = ['status']

    def get_queryset(self):
        queryset = Patent.objects.all()
        inventors = self.request.query_params.get('inventors')
        if inventors:
            queryset = queryset.filter(inventors__id=inventors)
        return queryset.distinct()

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)
