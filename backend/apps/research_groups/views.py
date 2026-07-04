from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticatedOrReadOnly, AllowAny
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Count, Q
from core.permissions import IsOwnerOrReadOnly
from .models import ResearchGroup
from .serializers import ResearchGroupSerializer


class ResearchGroupViewSet(viewsets.ModelViewSet):
    queryset = ResearchGroup.objects.filter(is_active=True)
    serializer_class = ResearchGroupSerializer
    search_fields = ['name', 'description']

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            from rest_framework.permissions import IsAuthenticated
            return [IsAuthenticated()]
        return [IsAuthenticatedOrReadOnly()]

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user, founder=self.request.user)

    @action(detail=True, methods=['get'], url_path='publications', permission_classes=[AllowAny])
    def group_publications(self, request, pk=None):
        group = self.get_object()
        member_ids = list(group.members.values_list('id', flat=True))
        if not member_ids:
            return Response([])
        from apps.publications.models import Publication
        from apps.publications.serializers import PublicationSerializer
        # Önce en az 2 grup üyesinin yazar olduğu yayın ID'lerini bul
        from django.db.models import Count, Q
        pub_ids = Publication.objects.filter(
            authors__id__in=member_ids
        ).annotate(
        member_count=Count('authors', filter=Q(authors__id__in=member_ids))
    ).filter(member_count__gte=2).values_list('id', flat=True)
        pubs = Publication.objects.filter(id__in=pub_ids)
        serializer = PublicationSerializer(pubs, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['get'], url_path='projects', permission_classes=[AllowAny])
    def group_projects(self, request, pk=None):
        group = self.get_object()
        member_ids = list(group.members.values_list('id', flat=True))
        if not member_ids:
            return Response([])
        from apps.projects.models import Project
        from apps.projects.serializers import ProjectSerializer
        from django.db.models import Count, Q
        proj_ids = Project.objects.filter(
            members__id__in=member_ids
        ).annotate(
        member_count=Count('members', filter=Q(members__id__in=member_ids))
    ).filter(member_count__gte=2).values_list('id', flat=True)
        projects = Project.objects.filter(id__in=proj_ids)
        serializer = ProjectSerializer(projects, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'], url_path='patents', permission_classes=[AllowAny])
    def group_patents(self, request, pk=None):
        group = self.get_object()
        member_ids = list(group.members.values_list('id', flat=True))
        if not member_ids:
            return Response([])
        from apps.patents.models import Patent
        from apps.patents.serializers import PatentSerializer
        from django.db.models import Count, Q
        patent_ids = Patent.objects.filter(
            inventors__id__in=member_ids
        ).annotate(
            member_count=Count('inventors', filter=Q(inventors__id__in=member_ids))
    ).filter(member_count__gte=2).values_list('id', flat=True)
        patents = Patent.objects.filter(id__in=patent_ids)
        serializer = PatentSerializer(patents, many=True)
        return Response(serializer.data)