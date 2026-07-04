from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticatedOrReadOnly, AllowAny
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Count
from core.permissions import IsOwnerOrReadOnly
from .models import Publication
from .serializers import PublicationSerializer


class PublicationViewSet(viewsets.ModelViewSet):
    serializer_class = PublicationSerializer
    permission_classes = [IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly]
    search_fields = ['title', 'authors__first_name', 'authors__last_name', 'journal']
    filterset_fields = ['pub_type', 'year']
    ordering_fields = ['year', 'created_at']

    def get_queryset(self):
        queryset = Publication.objects.all()
        authors = self.request.query_params.get('authors')
        if authors:
            queryset = queryset.filter(authors__id=authors)
        return queryset.distinct()

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

    @action(detail=False, methods=['get'], url_path='stats-by-year', permission_classes=[AllowAny])
    def stats_by_year(self, request):
        data = (
            Publication.objects
            .values('year')
            .annotate(count=Count('id'))
            .order_by('year')
        )
        return Response(list(data))
