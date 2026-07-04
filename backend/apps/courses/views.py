from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from core.permissions import IsOwnerOrReadOnly
from .models import Course
from .serializers import CourseSerializer


class CourseViewSet(viewsets.ModelViewSet):
    serializer_class = CourseSerializer
    permission_classes = [IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly]
    filterset_fields = ['level', 'semester', 'year']
    search_fields = ['name', 'code']

    def get_queryset(self):
        queryset = Course.objects.all()
        instructor = self.request.query_params.get('instructor')
        if instructor:
            queryset = queryset.filter(instructor__id=instructor)
        return queryset.distinct()

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user, instructor=self.request.user)
