# administrativo/serializers.py

from rest_framework import serializers
from .models import Cargo, Empleado, Proyecto, ControlDeIngreso, Produccion, Herramienta, ListaDeChequeo, Verificacion, Prestamo
# Asegúrate de importar todos los modelos que necesites serializar

class CargoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cargo
        fields = '__all__' # Incluye todos los campos

class EmpleadoSerializer(serializers.ModelSerializer):
    # Para mostrar detalles del cargo en lugar de solo el ID (opcional)
    cargo_detalle = CargoSerializer(source='cargo', read_only=True)
    # Para permitir asignar por ID al crear/actualizar
    # cargo = serializers.PrimaryKeyRelatedField(queryset=Cargo.objects.all()) # Si no quieres el detalle al escribir

    class Meta:
        model = Empleado
        fields = [
            'id', 'cargo', 'cargo_detalle', 'cedula', 'nombres', 'telefono',
            'email', 'estado', 'fecha_creacion', 'fecha_registro',
            'huella', 'nivel_acceso'
        ]
        # 'huella' es BinaryField. DRF lo maneja, usualmente como string base64 en JSON.
        read_only_fields = ['fecha_creacion', 'fecha_registro', 'cargo_detalle']


class ProyectoSerializer(serializers.ModelSerializer):
    supervisor_detalle = EmpleadoSerializer(source='supervisor', read_only=True)
    # supervisor = serializers.PrimaryKeyRelatedField(queryset=Empleado.objects.all(), allow_null=True, required=False)

    class Meta:
        model = Proyecto
        fields = [
            'id', 'nombre', 'descripcion', 'fecha_inicio', 'estado',
            'supervisor', 'supervisor_detalle', 'fecha_creacion'
        ]
        read_only_fields = ['fecha_creacion', 'supervisor_detalle']

# --- Serializers para los otros modelos ---
# (Como los que te proporcioné en respuestas anteriores)

class ControlDeIngresoSerializer(serializers.ModelSerializer):
    empleado_detalle = EmpleadoSerializer(source='empleado', read_only=True)
    proyecto_detalle = ProyectoSerializer(source='proyecto', read_only=True)
    class Meta:
        model = ControlDeIngreso
        fields = '__all__' # O especifica los campos que quieres
        read_only_fields = ['empleado_detalle', 'proyecto_detalle']


class ProduccionSerializer(serializers.ModelSerializer):
    empleado_detalle = EmpleadoSerializer(source='empleado', read_only=True)
    proyecto_detalle = ProyectoSerializer(source='proyecto', read_only=True)
    class Meta:
        model = Produccion
        fields = '__all__'
        read_only_fields = ['empleado_detalle', 'proyecto_detalle', 'fecha_registro']


class HerramientaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Herramienta
        fields = '__all__'


class ListaDeChequeoSerializer(serializers.ModelSerializer):
    herramienta_detalle = HerramientaSerializer(source='herramienta', read_only=True)
    class Meta:
        model = ListaDeChequeo
        fields = '__all__'
        read_only_fields = ['herramienta_detalle']


class VerificacionSerializer(serializers.ModelSerializer):
    lista_detalle = ListaDeChequeoSerializer(source='lista', read_only=True)
    class Meta:
        model = Verificacion
        fields = '__all__'
        read_only_fields = ['lista_detalle', 'fecha_verificacion']


class PrestamoSerializer(serializers.ModelSerializer):
    verificacion_detalle = VerificacionSerializer(source='verificacion', read_only=True)
    empleado_detalle = EmpleadoSerializer(source='empleado', read_only=True)
    herramienta_prestada_detalle = HerramientaSerializer(source='herramienta_prestada', read_only=True)
    class Meta:
        model = Prestamo
        fields = '__all__'
        read_only_fields = ['verificacion_detalle', 'empleado_detalle', 'herramienta_prestada_detalle']