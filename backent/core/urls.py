from rest_framework import routers
from .views import (
    CargosViewSet, EmpleadosViewSet, ProyectosViewSet, ProduccionViewSet,
    ControlDeIngresoViewSet, HerramientasViewSet, ListaDeChequeoViewSet,
    VerificacionViewSet, PrestamoViewSet
)
from django.urls import path, include

router = routers.DefaultRouter()
router.register(r'cargos', CargosViewSet)
router.register(r'empleados', EmpleadosViewSet)
router.register(r'proyectos', ProyectosViewSet)
router.register(r'produccion', ProduccionViewSet)
router.register(r'control_de_ingreso', ControlDeIngresoViewSet)
router.register(r'herramientas', HerramientasViewSet)
router.register(r'lista_de_chequeo', ListaDeChequeoViewSet)
router.register(r'verificacion', VerificacionViewSet)
router.register(r'prestamo', PrestamoViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
