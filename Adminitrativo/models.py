from django.db import models
from django.utils import timezone
from django.apps import AppConfig

# Asumimos que necesitarás un modelo de Usuario para el supervisor,
# aunque no está explícitamente en el diagrama principal.
# Para simplificar, usaremos un modelo de Empleado como supervisor por ahora,
# o podríamos usar el modelo de usuario de Django si la autenticación es relevante.
# Por la estructura, parece que 'supervisor_id' apunta a la tabla 'Empleados'.
# Vamos a definir Empleado primero ya que Cargos depende de él.

class Cargo(models.Model):
    """Representa los cargos o puestos de trabajo."""
    nombre_cargo = models.CharField(max_length=100, unique=True)
    descripcion = models.TextField(blank=True, null=True)
    # Podrías usar Choices para nivel_acceso si los niveles son fijos (ej: 'bajo', 'medio', 'alto')
    nivel_acceso = models.CharField(max_length=50)

    def __str__(self):
        return self.nombre_cargo

class Empleado(models.Model):
    """Representa a los empleados de la organización."""
    # cargo_id es una clave foránea a la tabla Cargo
    cargo = models.ForeignKey(Cargo, on_delete=models.PROTECT) # Proteger: no permitir borrar un Cargo si tiene empleados asociados
    cedula = models.CharField(max_length=20, unique=True)
    nombres = models.CharField(max_length=150)
    telefono = models.CharField(max_length=20, blank=True, null=True)
    email = models.EmailField(max_length=100, unique=True, blank=True, null=True)
    # estado puede ser un CharField con Choices (ej: 'activo', 'inactivo', 'vacaciones')
    estado = models.CharField(max_length=50, default='activo')
    fecha_creacion = models.DateTimeField(auto_now_add=True) # Se guarda la fecha/hora al crearse
    fecha_registro = models.DateField(auto_now_add=True) # Se guarda la fecha al crearse
    huella = models.BinaryField(blank=True, null=True) # Para datos binarios como una huella dactilar
    # nivel_acceso podría ser redundante si ya está en Cargo, pero lo incluimos si es específico del empleado
    nivel_acceso = models.CharField(max_length=50)

    def __str__(self):
        return f"{self.nombres} ({self.cedula})"

class Proyecto(models.Model):
    """Representa los proyectos."""
    nombre = models.CharField(max_length=200)
    descripcion = models.TextField(blank=True, null=True)
    fecha_inicio = models.DateField()
    # estado podría ser CharField con Choices (ej: 'planificacion', 'en_progreso', 'finalizado', 'cancelado')
    estado = models.CharField(max_length=50, default='planificacion')
    # supervisor_id es una clave foránea a la tabla Empleados
    supervisor = models.ForeignKey(Empleado, on_delete=models.SET_NULL, null=True, blank=True, related_name='proyectos_supervisados') # Permite que un proyecto no tenga supervisor
    fecha_creacion = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.nombre

class ControlDeIngreso(models.Model):
    """Registra los ingresos y salidas de empleados en proyectos/lugares."""
    fecha = models.DateField()
    hora_entrada = models.TimeField(blank=True, null=True)
    hora_salida = models.TimeField(blank=True, null=True)
    # estado_salud podría ser CharField (ej: 'ok', 'fiebre', 'reporte')
    estado_salud = models.CharField(max_length=50, blank=True, null=True)
    # id_empleado es clave foránea a Empleado
    empleado = models.ForeignKey(Empleado, on_delete=models.CASCADE, related_name='registros_ingreso')
    # id_proyecto es clave foránea a Proyecto
    proyecto = models.ForeignKey(Proyecto, on_delete=models.CASCADE, related_name='registros_ingreso')
    lugar_trabajo = models.CharField(max_length=100, blank=True, null=True)
    # estado puede referirse al estado del registro (ej: 'activo', 'cerrado', 'pendiente')
    estado = models.CharField(max_length=50, default='activo')
    observacion = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"Registro de {self.empleado} en {self.proyecto} el {self.fecha}"

class Produccion(models.Model):
    """Registra la producción de los empleados en proyectos."""
    # proyecto_id es clave foránea a Proyecto
    proyecto = models.ForeignKey(Proyecto, on_delete=models.CASCADE, related_name='producciones')
    # empleado_id es clave foránea a Empleado
    empleado = models.ForeignKey(Empleado, on_delete=models.CASCADE, related_name='producciones')
    fecha = models.DateField()
    cantidad_producida = models.DecimalField(max_digits=10, decimal_places=2) # Usamos DecimalField para cantidades que pueden no ser enteras
    observaciones = models.TextField(blank=True, null=True)
    fecha_registro = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Producción de {self.cantidad_producida} por {self.empleado} en {self.proyecto} el {self.fecha}"

class Herramienta(models.Model):
    """Representa las herramientas disponibles."""
    nombre = models.CharField(max_length=100)
    categoria = models.CharField(max_length=100, blank=True, null=True)
    cantidad = models.PositiveIntegerField(default=0) # Cantidad total disponible
    # estado puede ser CharField (ej: 'disponible', 'prestado', 'en_mantenimiento')
    estado = models.CharField(max_length=50, default='disponible')

    def __str__(self):
        return f"{self.nombre} ({self.cantidad} disponibles)"

class ListaDeChequeo(models.Model):
    """Representa listas de chequeo, posiblemente asociadas a herramientas."""
    nombre = models.CharField(max_length=150)
    categoria = models.CharField(max_length=100, blank=True, null=True)
    # estado puede ser CharField (ej: 'activo', 'inactivo', 'revisar')
    estado = models.CharField(max_length=50, default='activo')
    # id_herramienta es clave foránea a Herramienta
    herramienta = models.ForeignKey(Herramienta, on_delete=models.SET_NULL, null=True, blank=True, related_name='listas_chequeo') # Una lista de chequeo puede no estar asociada a una herramienta específica

    def __str__(self):
        return self.nombre

class Verificacion(models.Model):
    """Representa una verificación, posiblemente de una lista de chequeo o herramienta."""
    # id_lista es clave foránea a ListaDeChequeo
    lista = models.ForeignKey(ListaDeChequeo, on_delete=models.PROTECT, related_name='verificaciones') # Proteger: no borrar una lista si tiene verificaciones
    # estado de la verificación (ej: 'aprobado', 'rechazado', 'pendiente')
    estado = models.CharField(max_length=50)
    observaciones = models.TextField(blank=True, null=True)
    fecha_verificacion = models.DateTimeField(auto_now_add=True) # Añadimos fecha de verificación para saber cuándo se realizó

    def __str__(self):
        return f"Verificación de {self.lista} - {self.estado}"

class Prestamo(models.Model):
    """Registra el préstamo de herramientas."""
    # id_verificacion es clave foránea a Verificacion.
    # Asumimos que un préstamo requiere una verificación previa o está ligado a ella.
    verificacion = models.OneToOneField(Verificacion, on_delete=models.PROTECT, related_name='prestamo') # OneToOne si un préstamo se asocia a UNA ÚNICA verificación
    fecha_entrega = models.DateField()
    fecha_devolucion = models.DateField(blank=True, null=True) # La fecha de devolución puede ser nula si la herramienta aún está prestada

    # Aunque el diagrama no lo muestra, un préstamo lógicamente
    # debería estar asociado a un Empleado y a una Herramienta específica.
    # Añadimos estas relaciones basadas en el contexto típico de un préstamo.
    # Podrías ajustar esto si la lógica de negocio es diferente.
    empleado = models.ForeignKey(Empleado, on_delete=models.PROTECT, related_name='prestamos')
    herramienta_prestada = models.ForeignKey(Herramienta, on_delete=models.PROTECT, related_name='prestamos')


    def __str__(self):
        return f"Préstamo de {self.herramienta_prestada} a {self.empleado} ({self.fecha_entrega})"

class AdminitrativoConfig(AppConfig):  # Cambiado de EmpleadosConfig a AdminitrativoConfig
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'Adminitrativo'

