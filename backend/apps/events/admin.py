from django.contrib import admin
from .models import Event

@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = ['title', 'event_type', 'role', 'location', 'start_date']
    list_filter = ['event_type', 'role']
    search_fields = ['title', 'location']
    ordering = ['-start_date']
