from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserViewSet, CVDownloadView, PublicCVDownloadView

router = DefaultRouter()
router.register('', UserViewSet, basename='user')

urlpatterns = [
    path('', include(router.urls)),
    path('cv/download/', CVDownloadView.as_view(), name='cv-download'),
    path('<int:pk>/cv/', PublicCVDownloadView.as_view(), name='cv-download-public'),
]