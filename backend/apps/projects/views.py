from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticatedOrReadOnly, AllowAny
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Count
from core.permissions import IsOwnerOrReadOnly
from .models import Project
from .serializers import ProjectSerializer


class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    permission_classes = [IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly]
    search_fields = ['title', 'coordinator__first_name']
    filterset_fields = ['project_type', 'status']

    def get_queryset(self):
        queryset = Project.objects.all()
        members = self.request.query_params.get('members')
        if members:
            queryset = queryset.filter(members__id=members) | queryset.filter(owner__id=members)
        return queryset.distinct()

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

    @action(detail=False, methods=['get'], url_path='stats-by-year', permission_classes=[AllowAny])
    def stats_by_year(self, request):
        year_counts = {}
        for project in Project.objects.all():
            if project.start_date:
                year = str(project.start_date.year)
            else:
                year = str(project.created_at.year)
            year_counts[year] = year_counts.get(year, 0) + 1
        result = [{'year': int(y), 'count': c} for y, c in sorted(year_counts.items())]
        return Response(result)
