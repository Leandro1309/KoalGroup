import axios from 'axios';
import React, { useState } from 'react';
import { getEmployeeNameByCedula, getAreaByCedula } from '../../api/acces_control.api';
import { XIcon, CheckIcon } from 'lucide-react';

interface RegisterExitFormProps {
  onClose: () => void;
  onSubmit: (data: ExitFormData) => void;
}

export interface ExitFormData {
  employeeId: string;
  name: string;
  area: string;
  healthStatus: string;
  notes?: string;
}

export const RegisterExitForm: React.FC<RegisterExitFormProps> = ({ onClose, onSubmit }) => {
  // Estado local para almacenar los datos del formulario, inicializados vacíos.
  const [formData, setFormData] = useState<ExitFormData>({
    employeeId: '',
    name: '',
    area: '',
    healthStatus: '',
    notes: ''
  });

  // Estado para controlar si está buscando el nombre
  const [loadingName, setLoadingName] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string |null>(null); //Nuevo estado para el mensaje de error

  /**
   * Maneja el cambio en el campo de cédula:
   * - Autocompleta el nombre del empleado usando la cédula.
   * - Autocompleta el área de trabajo previa si existe.
   */
  const handleCedulaChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, employeeId: value }));
    setErrorMessage(null);
    if (value.length > 0) {
      setLoadingName(true);
      try {
        // Busca el nombre del empleado por cédula
        const nombreCompleto = await getEmployeeNameByCedula(value);
        setFormData(prev => ({ ...prev, name: nombreCompleto }));

        // Busca el área de trabajo previa por cédula
        try {
          const area = await getAreaByCedula(value);
          setFormData(prev => ({ ...prev, area }));
        } catch {
          // Si no hay área previa, deja el campo vacío
          setFormData(prev => ({ ...prev, area: '' }));
        }
      } catch {
        // Si no encuentra el empleado, limpia nombre y área
        setFormData(prev => ({ ...prev, name: '', area: '' }));
      }
      setLoadingName(false);
    } else {
      // Si el campo queda vacío, limpia nombre y área
      setFormData(prev => ({ ...prev, name: '', area: '' }));
    }
  };

  /**
   * Maneja los cambios en los campos del formulario y actualiza el estado correspondiente.
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrorMessage(null);
  };

  /**
   * Maneja el envío del formulario:
   * - Previene el comportamiento por defecto.
   * - Llama a onSubmit y cierra el formulario.
   * - Envía los datos al backend.
   */
  const handleSubmit =  async(e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setErrorMessage(null);

    const payload = {
      cedula: formData.employeeId,
      nombre: formData.name,
      estado_salud : formData.healthStatus,
      lugar_trabajo: formData.area,
      observacion:  formData.notes,
    };

    try {
      const response  = await axios.post(
        'http://127.0.0.1:8000/api/v1/ControlDeAcceso/registrar-entrada-salida/',
        payload
      );

      alert(response.data.detail || 'Salida registrada correctamente');
      onClose();
    } catch (error: any) {
      const message = error.response.data.detail || error.response?.data.error || 'Error al registrar'; //
      setErrorMessage(message); // Mostrar el mensaje de error en el 
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      {/* Capa superpuesta oscura y centrada para el modal */}
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        {/* Contenedor principal del formulario, con fondo blanco y sombra */}
        <div className="flex justify-between items-center border-b p-4">
          {/* Encabezado del modal con título y botón de cerrar */}
          <h2 className="text-xl font-bold text-gray-800">Registrar Salida</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <XIcon size={24} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* Formulario de registro de salida */}
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Número de Cédula</label>
            <input
              type="text"
              name="employeeId"
              value={formData.employeeId}
              onChange={handleCedulaChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-800"
              required
            />
          </div>
          {/* Campo para el número de cédula del empleado */}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre Completo</label>
            <input
              type="text"
              name="name"
              value={loadingName ? 'Buscando...' : formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-800"
              required
              readOnly
            />
          </div>
          {/* Campo para el nombre completo del empleado */}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Área de Trabajo</label>
            <select
              name="area"
              value={formData.area}
              onChange={handleChange}
              aria-readonly
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-800"
              required
            >
              <option value="">Seleccione un área</option>
              <option value="Mina Norte">Mina Norte</option>
              <option value="Mina Sur">Mina Sur</option>
              <option value="Procesamiento">Procesamiento</option>
              <option value="Administración">Administración</option>
              <option value="Mantenimiento">Mantenimiento</option>
            </select>
          </div>
          {/* Campo desplegable para seleccionar el área de trabajo */}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Estado de Salud</label>
            <select
              name="healthStatus"
              value={formData.healthStatus}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-800"
              required
            >
              <option value="">Seleccione una opción</option>
              <option value="Bien">Bien</option>
              <option value="Regular">Regular</option>
              <option value="Mal">Mal</option>
            </select>
          </div>
          {/* Campo para el estado de salud del empleado */}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Observaciones (Opcional)</label>
            <textarea
              name="notes"
              value={formData.notes || ''}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-800"
            />
          </div>
          {/* Campo de texto para observaciones adicionales (opcional) */}
          
          {/* Mostrar el mensaje de error si existe */}
          {errorMessage && (
            <div className='text-red-600 text-sm mt-2'>
              {errorMessage}
            </div>
          )}
          <div className="flex justify-end space-x-3 pt-4">
            {/* Contenedor para los botones de acción */}
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
            >
              Cancelar
            </button>
            {/* Botón para cancelar y cerrar el formulario */}
            <button
              type="submit"
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center"
            >
              <CheckIcon size={18} className="mr-2" />
              Registrar Salida
            </button>
            {/* Botón para enviar el formulario */}
          </div>
        </form>
      </div>
    </div>
  );
};
// Fin del componente RegisterExitForm