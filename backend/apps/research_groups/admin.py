from django.contrib import admin
from .models import ResearchGroup

@admin.register(ResearchGroup)
class ResearchGroupAdmin(admin.ModelAdmin):
    list_display = ['name', 'founder', 'is_active', 'created_at']
    list_filter = ['is_active']
    search_fields = ['name']
    filter_horizontal = ['members']