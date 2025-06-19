# production_app/urls.py

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import InventoryItemViewSet, ProductionRecordViewSet

router = DefaultRouter()
router.register(r'inventory-items', InventoryItemViewSet)
router.register(r'production-records', ProductionRecordViewSet)

urlpatterns = [
    path('', include(router.urls)),
]