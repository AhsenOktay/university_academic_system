from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import MembershipViewSet

router = DefaultRouter()
router.register('', MembershipViewSet, basename='membership')

urlpatterns = [path('', include(router.urls))]