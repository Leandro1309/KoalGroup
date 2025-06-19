# tools_app/models.py

from django.db import models

class Tool(models.Model):
    """
    Representa una herramienta en el inventario.
    """
    nombre = models.CharField(max_length=255)
    categoria = models.CharField(max_length=100)
    descripcion = models.TextField(blank=True, null=True)
    cantidad = models.IntegerField()
    estado = models.CharField(
        max_length=50,
        choices=[
            ('Bueno', 'Bueno'),
            ('Regular', 'Regular'),
            ('Malo', 'Malo'),
            ('En Reparación', 'En Reparación'), # Añadido un estado común para herramientas
            ('Descartado', 'Descartado'),
        ],
        default='Bueno'
    )
    fecha_ultima_revision = models.DateField()
    ubicacion = models.CharField(max_length=255)
    observaciones = models.TextField(blank=True, null=True)
    encargado = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Herramienta"
        verbose_name_plural = "Herramientas"
        ordering = ['nombre'] # Ordenar por nombre por defecto

    def __str__(self):
        return f"{self.nombre} ({self.categoria}) - {self.estado}"