"""
BAS - Ana URL yapılandırması
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

admin.site.site_header = 'Belek Akademik Sistem'
admin.site.site_title = 'Belek Akademik Sistem'
admin.site.index_title = 'Yönetim Paneli'

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/v1/auth/', include('apps.users.urls')),
    path('api/v1/publications/', include('apps.publications.urls')),
    path('api/v1/projects/', include('apps.projects.urls')),
    path('api/v1/theses/', include('apps.theses.urls')),
    path('api/v1/research-groups/', include('apps.research_groups.urls')),
    path('api/v1/awards/', include('apps.awards.urls')),
    path('api/v1/patents/', include('apps.patents.urls')),
    path('api/v1/users/', include('apps.users.urls_users')),
    path('api/v1/events/', include('apps.events.urls')),
    path('api/v1/courses/', include('apps.courses.urls')),
    path('api/v1/memberships/', include('apps.memberships.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)