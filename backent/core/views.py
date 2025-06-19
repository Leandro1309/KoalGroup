from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Cargos, Empleados, Proyectos, Produccion, ControlDeIngreso, Herramientas, ListaDeChequeo, Verificacion, Prestamo, Informe, Gas, Inventario, FrenteDeTrabajo
from .serializers import (
    CargosSerializer, EmpleadosSerializer, ProyectosSerializer, ProduccionSerializer,
    ControlDeIngresoSerializer, HerramientasSerializer, ListaDeChequeoSerializer,
    VerificacionSerializer, PrestamoSerializer,
    InformeSerializer, GasSerializer, InventarioSerializer, FrenteDeTrabajoSerializer
)

class CargosViewSet(viewsets.ModelViewSet):
    queryset = Cargos.objects.all()
    serializer_class = CargosSerializer

class EmpleadosViewSet(viewsets.ModelViewSet):
    queryset = Empleados.objects.all()
    serializer_class = EmpleadosSerializer

    @action(detail=False, methods=['get'], url_path='buscar_por_cedula')
    def buscar_por_cedula(self, request):
        cedula = request.query_params.get('cedula')
        empleado = Empleados.objects.filter(cedula=cedula).first()
        if empleado:
            return Response({'nombre': empleado.nombres})
        return Response({'error': 'Empleado no encontrado'}, status=404)

    @action(detail=False, methods=['get'], url_path='area_por_cedula')
    def area_por_cedula(self, request):
        cedula = request.query_params.get('cedula')
        empleado = Empleados.objects.filter(cedula=cedula).first()
        if empleado and empleado.cargo:
            return Response({'area': empleado.cargo.nombre_cargo})
        return Response({'error': 'Empleado o área no encontrada'}, status=404)

class ProyectosViewSet(viewsets.ModelViewSet):
    queryset = Proyectos.objects.all()
    serializer_class = ProyectosSerializer

class ProduccionViewSet(viewsets.ModelViewSet):
    queryset = Produccion.objects.all()
    serializer_class = ProduccionSerializer

class ControlDeIngresoViewSet(viewsets.ModelViewSet):
    queryset = ControlDeIngreso.objects.all()
    serializer_class = ControlDeIngresoSerializer

    @action(detail=False, methods=['get'], url_path='filtrar')
    def filtrar(self, request):
        cedula = request.query_params.get('cedula')
        nombres = request.query_params.get('nombres')
        queryset = self.queryset
        if cedula:
            queryset = queryset.filter(empleado__cedula=cedula)
        if nombres:
            queryset = queryset.filter(empleado__nombres__icontains=nombres)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

class HerramientasViewSet(viewsets.ModelViewSet):
    queryset = Herramientas.objects.all()
    serializer_class = HerramientasSerializer

class ListaDeChequeoViewSet(viewsets.ModelViewSet):
    queryset = ListaDeChequeo.objects.all()
    serializer_class = ListaDeChequeoSerializer

class VerificacionViewSet(viewsets.ModelViewSet):
    queryset = Verificacion.objects.all()
    serializer_class = VerificacionSerializer

class PrestamoViewSet(viewsets.ModelViewSet):
    queryset = Prestamo.objects.all()
    serializer_class = PrestamoSerializer

class InformeViewSet(viewsets.ModelViewSet):
    queryset = Informe.objects.all()
    serializer_class = InformeSerializer

class GasViewSet(viewsets.ModelViewSet):
    queryset = Gas.objects.all()
    serializer_class = GasSerializer

class InventarioViewSet(viewsets.ModelViewSet):
    queryset = Inventario.objects.all()
    serializer_class = InventarioSerializer

class FrenteDeTrabajoViewSet(viewsets.ModelViewSet):
    queryset = FrenteDeTrabajo.objects.all()
    serializer_class = FrenteDeTrabajoSerializer
