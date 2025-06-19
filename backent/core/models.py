from django.db import models

class Cargos(models.Model):
    nombre_cargo = models.CharField(max_length=100)
    descripcion = models.TextField(blank=True)
    nivel_acceso = models.IntegerField()

    def __str__(self):
        return self.nombre_cargo

class Empleados(models.Model):
    cargo = models.ForeignKey(Cargos, on_delete=models.CASCADE)
    cedula = models.CharField(max_length=20, unique=True)
    nombres = models.CharField(max_length=200)
    fecha_contratacion = models.DateField()
    telefono = models.CharField(max_length=20, blank=True)
    email = models.EmailField(blank=True)
    estado = models.IntegerField()
    fecha_creacion = models.DateField(auto_now_add=True)
    id_prestamo = models.IntegerField(null=True, blank=True)
    huella = models.TextField(blank=True)
    nivel_acceso = models.IntegerField()

    def __str__(self):
        return self.nombres

class Proyectos(models.Model):
    nombre = models.CharField(max_length=200)
    descripcion = models.TextField(blank=True)
    fecha_inicio = models.DateField()
    estado = models.IntegerField()
    supervisor_id = models.IntegerField()
    fecha_creacion = models.DateField(auto_now_add=True)

    def __str__(self):
        return self.nombre

class Produccion(models.Model):
    proyecto = models.ForeignKey(Proyectos, on_delete=models.CASCADE)
    empleado = models.ForeignKey(Empleados, on_delete=models.CASCADE)
    fecha = models.DateField()
    cantidad_producida = models.IntegerField()
    observaciones = models.TextField(blank=True)
    fecha_registro = models.DateField(auto_now_add=True)

class ControlDeIngreso(models.Model):
    fecha = models.DateField()
    hora_entrada = models.TimeField()
    hora_salida = models.TimeField(null=True, blank=True)
    estado_salud = models.IntegerField()
    empleado = models.ForeignKey(Empleados, on_delete=models.CASCADE)
    proyecto = models.ForeignKey(Proyectos, on_delete=models.CASCADE)
    lugar_trabajo = models.CharField(max_length=200)
    estado = models.IntegerField()
    observacion = models.TextField(blank=True)

class Herramientas(models.Model):
    categoria = models.IntegerField()
    cantidad = models.IntegerField()
    estado = models.IntegerField()

class ListaDeChequeo(models.Model):
    categoria = models.IntegerField()
    nombre = models.CharField(max_length=200)
    herramienta = models.ForeignKey(Herramientas, on_delete=models.CASCADE)

class Verificacion(models.Model):
    lista = models.ForeignKey(ListaDeChequeo, on_delete=models.CASCADE)
    estado = models.IntegerField()
    observaciones = models.TextField(blank=True)

class Prestamo(models.Model):
    fecha_entrega = models.DateField()
    fecha_devolucion = models.DateField(null=True, blank=True)
    verificacion = models.ForeignKey(Verificacion, on_delete=models.CASCADE)

class Gas(models.Model):
    tipo_gas = models.CharField(max_length=100)
    cantidad = models.FloatField()
    fecha = models.DateField()
    responsable = models.ForeignKey(Empleados, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.tipo_gas} - {self.cantidad} ({self.fecha})"
