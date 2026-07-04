from django.contrib import admin
from .models import Award

@admin.register(Award)
class AwardAdmin(admin.ModelAdmin):
    list_display = ['title', 'given_by', 'recipient', 'year']
    list_filter = ['year']
    search_fields = ['title', 'given_by']
