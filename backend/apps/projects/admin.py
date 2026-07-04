from django.contrib import admin
from .models import Project

@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ['title', 'project_type', 'status', 'start_date']
    list_filter = ['project_type', 'status']
    search_fields = ['title']
