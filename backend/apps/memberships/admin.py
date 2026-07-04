from django.contrib import admin
from .models import Membership

@admin.register(Membership)
class MembershipAdmin(admin.ModelAdmin):
    list_display = ['organization', 'role', 'membership_type', 'start_year', 'is_active']
    list_filter = ['membership_type', 'is_active']
    search_fields = ['organization', 'role']
    ordering = ['-start_year']