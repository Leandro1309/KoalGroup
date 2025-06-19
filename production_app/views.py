# production_app/views.py

from rest_framework import viewsets
from .models import InventoryItem, ProductionRecord
from .serializers import InventoryItemSerializer, ProductionRecordSerializer

class InventoryItemViewSet(viewsets.ModelViewSet):
    queryset = InventoryItem.objects.all().order_by('id')
    serializer_class = InventoryItemSerializer

class ProductionRecordViewSet(viewsets.ModelViewSet):
    queryset = ProductionRecord.objects.all().order_by('-production_date', 'work_front') # Ordenar por fecha descendente
    serializer_class = ProductionRecordSerializer