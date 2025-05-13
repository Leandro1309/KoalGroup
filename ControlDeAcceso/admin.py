from django.contrib import admin
from .models import Cargo,Empleado,Proyecto,ControlDeIngreso


class CargoAdmin(admin.ModelAdmin):
    list_display = ('nombre_cargo','descripcion','nivel_acceso')
admin.site.register(Cargo,CargoAdmin)
    

class ProyectoAdmin(admin.ModelAdmin) : 
    list_display = ('nombre','descripcion','fecha_inicio','estado','supervisor','fecha_creacion')
admin.site.register(Proyecto,ProyectoAdmin)

class EmpleadoAdmin(admin.ModelAdmin):
    list_display= ('cargo','cedula','nombres','telefono','email','estado','fecha_creacion','fecha_registro',
    'huella','nivel_acceso')
    
admin.site.register(Empleado,EmpleadoAdmin)

class ControlDeIngresoAdmin(admin.ModelAdmin):
    list_display = ('cedula','fecha','hora_entrada','hora_salida','estado_salud_entrada','estado_salud_Salida',
    'proyecto','lugar_trabajo','estado','observacion')
admin.site.register(ControlDeIngreso,ControlDeIngresoAdmin) 
 

    
# Register your models here.