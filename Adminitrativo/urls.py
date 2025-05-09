# Administrativo/urls.py

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'cargos', views.CargoViewSet, basename='cargo')
router.register(r'empleados', views.EmpleadoViewSet, basename='empleado')
router.register(r'proyectos', views.ProyectoViewSet, basename='proyecto')
router.register(r'control-ingresos', views.ControlDeIngresoViewSet, basename='controlingreso')
router.register(r'produccion', views.ProduccionViewSet, basename='produccion')
router.register(r'herramientas', views.HerramientaViewSet, basename='herramienta')
router.register(r'listas-chequeo', views.ListaDeChequeoViewSet, basename='listachequeo')
router.register(r'verificaciones', views.VerificacionViewSet, basename='verificacion')
router.register(r'prestamos', views.PrestamoViewSet, basename='prestamo')

# URLs para las vistas personalizadas (no ViewSets)
urlpatterns = [
    path('', include(router.urls)),
    # Dashboard URLs
    path('dashboard/stats/', views.DashboardStatsView.as_view(), name='dashboard-stats'),
    path('dashboard/production-by-project/', views.ProduccionPorProyectoView.as_view(), name='dashboard-production-by-project'),
    # Report URLs
    path('reports/generate/', views.ReportGeneratorView.as_view(), name='report-generate'),
    # path('reports/download/<str:filename>/', views.download_report_file, name='report-download'), # Si implementas descarga directa
]