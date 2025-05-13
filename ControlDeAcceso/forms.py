from django import forms

class RegistroEmpleados(forms.Form):
    cedula = forms.IntegerField(label="Cédula", widget=forms.TextInput(attrs={
        'class': 'form-control',
        'placeholder': 'Ingrese su cédula'
    }))
    
    nombre = forms.CharField(label="Nombre", max_length=150, widget=forms.TextInput(attrs={'class': 'form-control',
        'placeholder': 'Ingrese su nombre completo'
    }))
    
    
    estado_salud = forms.ChoiceField(choices=[
        ('Bien', 'Bien'),
        ('Regular', 'Regular'),
        ('Mal', 'Mal'),
    ])
