"""
urlpatterns:
    - 'admin/': Ruta para el panel de administración de Django.
    - 'api/v1/': Incluye las URLs definidas en el módulo 'access_control.urls', agrupando los endpoints de la API bajo la versión 1.
    - 'api/schema/': Proporciona el esquema OpenAPI de la API utilizando SpectacularAPIView.
    - 'api/docs/': Muestra la documentación interactiva Swagger UI basada en el esquema generado, permitiendo explorar y probar los endpoints de la API.
URL configuration for backendKoalGroup project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/v1/', include('access_control.urls')),
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
]