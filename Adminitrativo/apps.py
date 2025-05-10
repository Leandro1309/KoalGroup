from django.apps import AppConfig


class AdminitrativoConfig(AppConfig):  # Cambiado de EmpleadosConfig a AdminitrativoConfig
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'Adminitrativo'  # Asegúrate de que coincida con el nombre de la carpeta
