# tools_app/serializers.py

from rest_framework import serializers
from .models import Tool

class ToolSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tool
        fields = '__all__' # Incluye todos los campos del modelo