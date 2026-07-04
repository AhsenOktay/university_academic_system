from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ThesisViewSet

router = DefaultRouter()
router.register('', ThesisViewSet, basename='thesis')

urlpatterns = [path('', include(router.urls))]
