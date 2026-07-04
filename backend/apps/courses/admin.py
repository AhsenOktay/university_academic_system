from django.contrib import admin
from .models import Course

@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ['name', 'code', 'level', 'semester', 'year']
    list_filter = ['level', 'semester']
    search_fields = ['name', 'code']
    ordering = ['-year']