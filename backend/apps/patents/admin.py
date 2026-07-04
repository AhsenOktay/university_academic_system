from django.contrib import admin
from .models import Patent

@admin.register(Patent)
class PatentAdmin(admin.ModelAdmin):
    list_display = ['title', 'patent_no', 'status', 'application_date']
    list_filter = ['status']
    search_fields = ['title', 'patent_no']
