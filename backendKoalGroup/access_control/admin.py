from django.contrib import admin


from .models import Cargo, Empleado, Proyecto, ControlDeIngreso

@admin.register(Cargo)
class CargoAdmin(admin.ModelAdmin):
    list_display = ('id', 'nombre_cargo', 'descripcion', 'nivel_acceso')
    search_fields = ('nombre_cargo',)

@admin.register(Empleado)
class EmpleadoAdmin(admin.ModelAdmin):
    list_display = ('id', 'cedula', 'nombres', 'telefono', 'email', 'estado', 'nivel_acceso', 'cargo')
    search_fields = ('cedula', 'nombres', 'email')
    list_filter = ('estado', 'cargo')

@admin.register(Proyecto)
class ProyectoAdmin(admin.ModelAdmin):
    list_display = ('id', 'nombre', 'descripcion', 'fecha_inicio', 'estado', 'supervisor')
    search_fields = ('nombre',)
    list_filter = ('estado',)

@admin.register(ControlDeIngreso)
class ControlDeIngresoAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'cedula',
        'fecha',
        'hora_entrada',
        'hora_salida',
        'estado_salud_entrada',
        'estado_salud_Salida',
        'proyecto',
        'lugar_trabajo',
        'estado',
        'observacion',
    )
    search_fields = ('cedula__nombres', 'cedula__cedula', 'proyecto__nombre', 'lugar_trabajo')
    list_filter = ('fecha', 'proyecto', 'estado_salud_entrada', 'estado_salud_Salida', 'estado')