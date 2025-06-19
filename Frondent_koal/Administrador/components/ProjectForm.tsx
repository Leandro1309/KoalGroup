import React, { useState } from 'react';
import { SaveIcon, Loader } from 'lucide-react';
import { projectService, Project } from '../services/api';

interface FormData {
  name: string;
  location: string;
  startDate: string;
  description: string;
  manager: string;
  status: string;
}

interface FormErrors {
  name?: string;
  location?: string;
  startDate?: string;
  description?: string;
  manager?: string;
}

export const ProjectForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    location: '',
    startDate: '',
    description: '',
    manager: '',
    status: 'Activo'
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    // Validar nombre
    if (!formData.name.trim()) {
      newErrors.name = 'El nombre del proyecto es requerido';
    } else if (formData.name.length < 3) {
      newErrors.name = 'El nombre debe tener al menos 3 caracteres';
    }

    // Validar ubicación
    if (!formData.location.trim()) {
      newErrors.location = 'La ubicación es requerida';
    }

    // Validar fecha de inicio
    if (!formData.startDate) {
      newErrors.startDate = 'La fecha de inicio es requerida';
    } else {
      const startDate = new Date(formData.startDate);
      const today = new Date();
      if (startDate < today) {
        newErrors.startDate = 'La fecha de inicio no puede ser anterior a hoy';
      }
    }

    // Validar descripción
    if (!formData.description.trim()) {
      newErrors.description = 'La descripción es requerida';
    } else if (formData.description.length < 10) {
      newErrors.description = 'La descripción debe tener al menos 10 caracteres';
    }

    // Validar supervisor
    if (!formData.manager) {
      newErrors.manager = 'Debe seleccionar un supervisor';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Limpiar el error del campo que se está modificando
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSuccess(false);

      const response = await projectService.create(formData);
      console.log('Proyecto creado:', response.data);
      
      setSuccess(true);
      setFormData({
        name: '',
        location: '',
        startDate: '',
        description: '',
        manager: '',
        status: 'Activo'
      });
    } catch (err) {
      console.error('Error al crear proyecto:', err);
      setError('Error al crear el proyecto');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Crear Nuevo Proyecto</h2>
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded">
          Proyecto creado exitosamente
        </div>
      )}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Nombre del Proyecto
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                disabled={loading}
                className={`w-full px-3 py-2 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500`}
              />
              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
            </div>
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                Ubicación
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
                disabled={loading}
                className={`w-full px-3 py-2 border ${errors.location ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500`}
              />
              {errors.location && <p className="mt-1 text-sm text-red-600">{errors.location}</p>}
            </div>
            <div>
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                Fecha de Inicio
              </label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                required
                disabled={loading}
                className={`w-full px-3 py-2 border ${errors.startDate ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500`}
              />
              {errors.startDate && <p className="mt-1 text-sm text-red-600">{errors.startDate}</p>}
            </div>
            <div>
              <label htmlFor="manager" className="block text-sm font-medium text-gray-700 mb-1">
                Supervisión de Proyecto
              </label>
              <select
                id="manager"
                name="manager"
                value={formData.manager}
                onChange={handleChange}
                disabled={loading}
                className={`w-full px-3 py-2 border ${errors.manager ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500`}
              >
                <option value="">Seleccionar Supervisor</option>
                <option value="1">Carlos Rodríguez</option>
                <option value="2">Ana Martínez</option>
              </select>
              {errors.manager && <p className="mt-1 text-sm text-red-600">{errors.manager}</p>}
            </div>
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Descripción
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              disabled={loading}
              className={`w-full px-3 py-2 border ${errors.description ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500`}
            ></textarea>
            {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
          </div>
          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className={`flex items-center gap-2 bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700 ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {loading ? (
                <>
                  <Loader className="animate-spin" size={16} />
                  <span>Guardando...</span>
                </>
              ) : (
                <>
                  <SaveIcon size={16} />
                  <span>Guardar Proyecto</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="font-semibold text-lg mb-4">Asignar Personal</h3>
        <p className="text-gray-500 mb-4">
          Primero guarde el proyecto para poder asignar personal.
        </p>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nombre
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rol
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            <tr>
              <td colSpan={3} className="px-6 py-4 text-center text-gray-500">
                Sin personal asignado
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};