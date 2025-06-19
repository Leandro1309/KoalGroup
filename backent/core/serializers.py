from rest_framework import serializers
from .models import Cargos, Empleados, Proyectos, Produccion, ControlDeIngreso, Herramientas, ListaDeChequeo, Verificacion, Prestamo, Informe, Gas, Inventario, FrenteDeTrabajo

class CargosSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cargos
        fields = '__all__'

class EmpleadosSerializer(serializers.ModelSerializer):
    class Meta:
        model = Empleados
        fields = '__all__'

class ProyectosSerializer(serializers.ModelSerializer):
    class Meta:
        model = Proyectos
        fields = '__all__'

class ProduccionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Produccion
        fields = '__all__'

class ControlDeIngresoSerializer(serializers.ModelSerializer):
    class Meta:
        model = ControlDeIngreso
        fields = '__all__'

class HerramientasSerializer(serializers.ModelSerializer):
    class Meta:
        model = Herramientas
        fields = '__all__'

class ListaDeChequeoSerializer(serializers.ModelSerializer):
    class Meta:
        model = ListaDeChequeo
        fields = '__all__'

class VerificacionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Verificacion
        fields = '__all__'

class PrestamoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Prestamo
        fields = '__all__'

class InformeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Informe
        fields = '__all__'

class GasSerializer(serializers.ModelSerializer):
    class Meta:
        model = Gas
        fields = '__all__'

class InventarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Inventario
        fields = '__all__'

class FrenteDeTrabajoSerializer(serializers.ModelSerializer):
    class Meta:
        model = FrenteDeTrabajo
        fields = '__all__'
