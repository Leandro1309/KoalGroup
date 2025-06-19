# production_app/serializers.py

from rest_framework import serializers
from .models import InventoryItem, ProductionRecord

class InventoryItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = InventoryItem
        fields = '__all__' # Incluye todos los campos

class ProductionRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductionRecord
        fields = '__all__' # Incluye todos los campos