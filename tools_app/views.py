# tools_app/views.py

from rest_framework import viewsets
from .models import Tool
from .serializers import ToolSerializer

class ToolViewSet(viewsets.ModelViewSet):
    queryset = Tool.objects.all()
    serializer_class = ToolSerializer

    # Opcional: puedes añadir filtros, permisos, etc., aquí
    # Por ejemplo, para ordenar por nombre:
    # queryset = Tool.objects.all().order_by('nombre')