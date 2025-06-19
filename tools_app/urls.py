# tools_app/urls.py

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ToolViewSet

router = DefaultRouter()
router.register(r'tools', ToolViewSet) # La URL será /api/tools/

urlpatterns = [
    path('', include(router.urls)),
]