# production_app/models.py

from django.db import models

class InventoryItem(models.Model):
    """
    Representa un item en el inventario de materiales o herramientas.
    """
    name = models.CharField(max_length=255, unique=True)
    quantity = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    unit = models.CharField(max_length=50) # Ej: Toneladas, Unidades, Litros
    location = models.CharField(max_length=255, blank=True, null=True) # Dónde se almacena
    last_updated = models.DateField(auto_now=True)
    status = models.CharField(
        max_length=50,
        choices=[
            ('Bueno', 'Bueno'),
            ('Regular', 'Regular'),
            ('Malo', 'Malo'),
            ('Agotado', 'Agotado'),
        ],
        default='Bueno'
    )
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.name} ({self.quantity} {self.unit})"

class ProductionRecord(models.Model):
    """
    Registra la producción diaria de un frente de trabajo.
    """
    production_date = models.DateField()
    work_front = models.CharField(max_length=255) # Podríamos vincularlo a un modelo WorkFront, pero lo mantenemos simple por ahora
    material_type = models.CharField(max_length=255) # Ej: Carbón Tipo A, Mineral de Hierro
    quantity_produced = models.DecimalField(max_digits=10, decimal_places=2)
    unit = models.CharField(max_length=50) # Ej: Toneladas, Metros cúbicos
    quality = models.CharField(
        max_length=50,
        choices=[
            ('Alta', 'Alta'),
            ('Media', 'Media'),
            ('Baja', 'Baja'),
        ],
        default='Media'
    )
    supervisor = models.CharField(max_length=255)
    observations = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-production_date', 'work_front'] # Ordenar por fecha descendente

    def __str__(self):
        return f"Producción de {self.material_type} en {self.work_front} el {self.production_date}"