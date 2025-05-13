#Funcion para registrar entrada y salida 
from django.shortcuts import render, redirect
from django.utils import timezone
from django.contrib import messages
from .forms import RegistroEmpleados
from .models import Empleado, Proyecto, ControlDeIngreso

def registrar_personas(request):
    if request.method == 'POST':
        form = RegistroEmpleados(request.POST)
        if form.is_valid():
            # Obtener datos del formulario
            cedula = form.cleaned_data['cedula']
            nombre = form.cleaned_data['nombre']
            estado_salud = form.cleaned_data['estado_salud']

            try:
                # Buscar empleado por cédula
                #Busca  si la cedula que registró el el empleado coincide con la que esta en la base de datos 
                #Y tambien busca si el que registró el empleado coincide con el nombre registrado en la base de datos 
                empleado = Empleado.objects.get(cedula=cedula, nombres=nombre)
            except Empleado.DoesNotExist:
                # Si no coinciden los datos pues bota una mensaje de error 
                messages.error(request, 'La cédula o el nombre  no están registrados en el sistema intente nuevamente .')
                return render(request, 'IngresoSalida.html', {'form': form})

            # Obtener la fecha actual
            hoy = timezone.now().date() # <- En esta variable obtiene la fecha actual y se guarda en esta misma variable 

            # Buscar el último registro de entrada sin salida
            registro = ControlDeIngreso.objects.filter(
                cedula=empleado,  # Usamos 'cedula' como clave foránea al modelo Empleado
                fecha=hoy, 
                hora_salida__isnull=True
            ).last()

            if registro:
                # Si ya tiene entrada hoy, registrar salida
                registro.hora_salida = timezone.now().time()
                registro.estado_salud_Salida = estado_salud  # Asegúrate de que este campo exista en el modelo
                registro.save()
                messages.success(request, 'Salida registrada correctamente.')
            else:
                # Si no tiene entrada hoy, registrar nueva entrada
                proyecto = Proyecto.objects.first() # Se le asigna un proyecto al empleado
                # Puedes cambiar esto para asignar un proyecto específico según tu lógica
                if not proyecto:
                    # Si no hay proyectos disponibles, mostrar error
                    form.add_error(None, 'No hay proyectos disponibles para asignar.')
                    messages.error(request, 'No hay proyectos disponibles para asignar.')
                    return render(request, 'IngresoSalida.html', {'form': form})

                # Crear un nuevo registro de entrada
                ControlDeIngreso.objects.create(
                    cedula=empleado,  # Usamos 'cedula' como clave foránea al modelo Empleado
                    fecha=hoy,
                    hora_entrada=timezone.now().time(),
                    estado_salud_entrada=estado_salud,  # Asegúrate de que este campo exista en el modelo
                    proyecto=proyecto,
                    estado='activo'
                )
                messages.success(request, 'Entrada registrada correctamente.')

            # Redirigir a una página de éxito o mostrar mensaje
            return redirect('IngresoSalida.html', {'form':form})  # Cambia por el nombre real de la vista en urls.py
    else:
        # Si no es POST, mostrar formulario vacío
        form = RegistroEmpleados()
    # Renderizar la plantilla con el formulario
    return render(request, 'IngresoSalida.html', {'form': form})

