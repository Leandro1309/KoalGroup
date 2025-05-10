# Administrativo/views.py

from rest_framework import viewsets, permissions, status # permissions y status son útiles
from rest_framework.response import Response # Para respuestas personalizadas si es necesario
from rest_framework.decorators import action # Para acciones personalizadas en ViewSets
from django.db.models import Count, Sum, Q, F # Para consultas más complejas si las necesitas

from .models import (
    Cargo, Empleado, Proyecto, ControlDeIngreso,
    Produccion, Herramienta, ListaDeChequeo, Verificacion, Prestamo
)
from .serializers import (
    CargoSerializer, EmpleadoSerializer, ProyectoSerializer, ControlDeIngresoSerializer,
    ProduccionSerializer, HerramientaSerializer, ListaDeChequeoSerializer,
    VerificacionSerializer, PrestamoSerializer
)

# (Opcional) Permisos: Puedes empezar con AllowAny y luego ajustar a IsAuthenticated, etc.
# class IsAdminOrReadOnly(permissions.BasePermission):
#     """
#     Custom permission to only allow admin users to edit objects.
#     Read-only for non-admin users.
#     """
#     def has_permission(self, request, view):
#         if request.method in permissions.SAFE_METHODS: # GET, HEAD, OPTIONS
#             return True
#         return request.user and request.user.is_staff


class CargoViewSet(viewsets.ModelViewSet):
    queryset = Cargo.objects.all().order_by('nombre_cargo')
    serializer_class = CargoSerializer
    # permission_classes = [permissions.IsAuthenticated] # Ejemplo de permiso

class EmpleadoViewSet(viewsets.ModelViewSet):
    queryset = Empleado.objects.select_related('cargo').all().order_by('nombres') # Optimiza la carga del cargo
    serializer_class = EmpleadoSerializer
    # permission_classes = [permissions.IsAuthenticated]
    # Podrías añadir filtros aquí si lo necesitas (django-filter)
    # filterset_fields = ['cargo', 'estado', 'nivel_acceso']
    # search_fields = ['nombres', 'cedula', 'email']

class ProyectoViewSet(viewsets.ModelViewSet):
    queryset = Proyecto.objects.select_related('supervisor__cargo').all().order_by('-fecha_creacion') # Optimiza supervisor y su cargo
    serializer_class = ProyectoSerializer
    # permission_classes = [permissions.IsAuthenticated]
    # filterset_fields = ['estado', 'supervisor']
    # search_fields = ['nombre', 'descripcion']

    # Ejemplo de una acción personalizada para obtener solo ID y nombre (para selects en el frontend)
    @action(detail=False, methods=['get'], url_path='brief')
    def brief_list(self, request):
        proyectos = Proyecto.objects.values('id', 'nombre').order_by('nombre')
        return Response(proyectos)


class ControlDeIngresoViewSet(viewsets.ModelViewSet):
    queryset = ControlDeIngreso.objects.select_related('empleado', 'proyecto').all().order_by('-fecha', '-hora_entrada')
    serializer_class = ControlDeIngresoSerializer
    # permission_classes = [permissions.IsAuthenticated]
    # filterset_fields = ['empleado', 'proyecto', 'fecha', 'estado_salud']

class ProduccionViewSet(viewsets.ModelViewSet):
    queryset = Produccion.objects.select_related('empleado', 'proyecto').all().order_by('-fecha')
    serializer_class = ProduccionSerializer
    # permission_classes = [permissions.IsAuthenticated]
    # filterset_fields = ['empleado', 'proyecto', 'fecha']

class HerramientaViewSet(viewsets.ModelViewSet):
    queryset = Herramienta.objects.all().order_by('nombre')
    serializer_class = HerramientaSerializer
    # permission_classes = [permissions.IsAuthenticated]
    # filterset_fields = ['categoria', 'estado']
    # search_fields = ['nombre']

class ListaDeChequeoViewSet(viewsets.ModelViewSet):
    queryset = ListaDeChequeo.objects.select_related('herramienta').all().order_by('nombre')
    serializer_class = ListaDeChequeoSerializer
    # permission_classes = [permissions.IsAuthenticated]
    # filterset_fields = ['categoria', 'estado', 'herramienta']

class VerificacionViewSet(viewsets.ModelViewSet):
    queryset = Verificacion.objects.select_related('lista').all().order_by('-fecha_verificacion')
    serializer_class = VerificacionSerializer
    # permission_classes = [permissions.IsAuthenticated]
    # filterset_fields = ['lista', 'estado']

class PrestamoViewSet(viewsets.ModelViewSet):
    queryset = Prestamo.objects.select_related('verificacion__lista', 'empleado', 'herramienta_prestada').all().order_by('-fecha_entrega')
    serializer_class = PrestamoSerializer
    # permission_classes = [permissions.IsAuthenticated]
    # filterset_fields = ['empleado', 'herramienta_prestada', 'fecha_devolucion'] # fecha_devolucion=None para los no devueltos


# --- Vistas para el Dashboard (Ejemplos) ---
# Estas vistas serían más personalizadas y podrían no ser ModelViewSets.
# Podrías usar APIView o funciones decoradas con @api_view.

from rest_framework.views import APIView

class DashboardStatsView(APIView):
    # permission_classes = [permissions.IsAuthenticated]

    def get(self, request, format=None):
        # Estas son consultas de ejemplo, ajústalas a tu lógica real
        proyectos_activos = Proyecto.objects.filter(
            Q(estado='activo') | Q(estado='en_progreso')
        ).count()
        total_personal = Empleado.objects.filter(estado='activo').count()

        # Producción mensual estimada y informes generados son más complejos
        # y podrían requerir cálculos o tablas adicionales.
        # Aquí solo pongo placeholders.
        produccion_mensual_estimada = "1,250 t (calculado)" # Placeholder
        informes_generados = 0 # Placeholder, necesitarías un modelo de "InformeGenerado" o similar

        data = {
            'proyectos_activos': proyectos_activos,
            'total_personal': total_personal,
            'produccion_mensual_estimada': produccion_mensual_estimada,
            'informes_generados': informes_generados,
        }
        return Response(data)

class ProduccionPorProyectoView(APIView):
    # permission_classes = [permissions.IsAuthenticated]
    def get(self, request, format=None):
        # Ejemplo: Suma de producción por proyecto
        # Esto es una simplificación. Necesitarías definir cómo calcular el "porcentaje"
        # o qué métrica exacta mostrar.
        produccion_data = Produccion.objects.values(
            id_proyecto=F('proyecto__id'), # Usar el ID del proyecto directamente
            nombre_proyecto=F('proyecto__nombre')
        ).annotate(
            cantidad_total=Sum('cantidad_producida')
        ).order_by('-cantidad_total')[:5] # Top 5 por ejemplo

        # Para calcular porcentaje, necesitarías un total de referencia.
        # Aquí solo simularemos el formato que espera el frontend.
        response_data = [
            {
                "id": item['id_proyecto'],
                "nombre_proyecto": item['nombre_proyecto'],
                # El cálculo de porcentaje_produccion debe ser significativo
                "porcentaje_produccion": (float(item['cantidad_total']) / 1000) * 10 if item['cantidad_total'] else 0 # Simulación
            } for item in produccion_data
        ]
        return Response(response_data)


# --- Vista para Reportes (Ejemplo básico) ---
# La generación de reportes puede ser compleja. Podrías usar librerías como
# ReportLab para PDF, OpenPyXL para Excel, o simplemente devolver JSON.

from django.http import JsonResponse, HttpResponse # Para descargar archivos
# from reportlab.pdfgen import canvas # Ejemplo para PDF

class ReportGeneratorView(APIView):
    # permission_classes = [permissions.IsAuthenticated]

    def post(self, request, format=None):
        report_type = request.data.get('reportType')
        project_id = request.data.get('project')
        start_date_str = request.data.get('startDate')
        end_date_str = request.data.get('endDate')

        # Aquí iría tu lógica para filtrar datos y generar el reporte
        # basado en los parámetros.
        # Por ejemplo, si es 'employee_list':
        # queryset = Empleado.objects.all()
        # if project_id:
        #    queryset = queryset.filter(proyectos_asignados__id=project_id) # Si tienes una relación ManyToMany
        # if start_date_str and end_date_str: # Filtrar por rango de fechas si aplica al tipo de reporte
        #    queryset = queryset.filter(fecha_contratacion__range=[start_date_str, end_date_str])

        # serializer = EmpleadoSerializer(queryset, many=True)
        # report_data = serializer.data

        # Simulación de respuesta
        report_name = f"Informe de {report_type} ({project_id or 'Todos'})"
        # En un caso real, generarías un archivo y devolverías su URL o el archivo mismo.
        simulated_url = f"/api/administrativo/reports/download/simulated_report_{report_type}.pdf"

        return Response({
            "id": f"report_{request_id_generator.get_id()}", # Necesitarías un generador de IDs únicos
            "name": report_name,
            "url": simulated_url,
            "generatedDate": timezone.now().isoformat(),
            # "data": report_data # Si devuelves datos JSON directamente
        }, status=status.HTTP_200_OK)

# Necesitarás un generador de IDs si el ID del reporte se crea dinámicamente
import shortuuid
class RequestIdGenerator:
    def get_id(self):
        return shortuuid.uuid()
request_id_generator = RequestIdGenerator()


# (Opcional) Vista para descargar el archivo de reporte (si generas archivos)
# def download_report_file(request, filename):
#     # Aquí buscarías el archivo en tu sistema de archivos o almacenamiento en la nube
#     # y lo servirías. Esto es una simplificación.
#     # from django.conf import settings
#     # import os
#     # file_path = os.path.join(settings.MEDIA_ROOT, 'reports', filename)
#     # if os.path.exists(file_path):
#     #     with open(file_path, 'rb') as fh:
#     #         response = HttpResponse(fh.read(), content_type="application/pdf") # o el content_type correcto
#     #         response['Content-Disposition'] = f'inline; filename="{os.path.basename(file_path)}"'
#     #         return response
#     # raise Http404
#     return HttpResponse(f"Descarga simulada de {filename}", content_type="text/plain")