from django.contrib import admin
from .models import Publication

@admin.register(Publication)
class PublicationAdmin(admin.ModelAdmin):
    list_display = ['title', 'pub_type', 'year', 'created_at']
    list_filter = ['pub_type', 'year']
    search_fields = ['title', 'authors__email']
