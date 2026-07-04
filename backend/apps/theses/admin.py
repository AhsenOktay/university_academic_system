from django.contrib import admin
from .models import Thesis

@admin.register(Thesis)
class ThesisAdmin(admin.ModelAdmin):
    list_display = ['title', 'thesis_type', 'year', 'advisor']
    list_filter = ['thesis_type', 'year']
    search_fields = ['title']
