from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User



@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ['email', 'first_name', 'last_name', 'user_type', 'is_active']
    list_filter = ['user_type', 'is_active']
    search_fields = ['email', 'first_name', 'last_name']
    ordering = ['last_name', 'first_name']

    fieldsets = (
        ('Giriş Bilgileri', {'fields': ('email', 'password')}),
        ('Kişisel Bilgiler', {'fields': ('first_name', 'last_name', 'phone', 'profile_image_url')}),
        ('Akademik Bilgiler', {'fields': ('title', 'faculty', 'department')}),
        ('Kurumsal Bilgiler', {'fields': ('user_type', 'is_active')}),
    )

    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'first_name', 'last_name', 'user_type', 'password1', 'password2'),
        }),
    )