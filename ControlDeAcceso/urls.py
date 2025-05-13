from django.urls import path 
from .import views



urlpatterns = [
    path('', views.registrar_personas),
    path('IngresoSalida.html', views.registrar_personas, name='IngresoSalida'),
]

