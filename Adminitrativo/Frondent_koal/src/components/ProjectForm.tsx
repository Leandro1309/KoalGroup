import React, { useState, useEffect } from 'react';
import { SaveIcon, XIcon, Loader2 } from 'lucide-react';
import { createProject, updateProject, getProjectById,getAllEmployees } from '/..servicios/projectService';

import { Proyecto, ProyectoFormData, Empleado } from '../types/index'; // 

interface ProjectFormProps {
  projectToEdit?: Proyecto | null;
  onSuccess: () => void;
  onCancel: () => void;
}

const initialFormData: ProyectoFormData = {
  nombre: '',
  location: '', // Asegúrate que este campo sea manejado por tu backend si es necesario
  fecha_inicio: '',
  descripcion: '',
  manager: '', // ID del supervisor
  estado: 'planificacion', // Estado por defecto
};

export const ProjectForm: React.FC<ProjectFormProps> = ({ projectToEdit, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState<ProyectoFormData>(initialFormData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [supervisors, setSupervisors] = useState<Empleado[]>([]); // Para cargar la lista de supervisores

  useEffect(() => {
    const fetchSupervisors = async () => {
      try {
        const emps = await getAllEmployees({ cargo: 'Supervisor' });
        setSupervisors(emps);
      } catch (err) {
        console.error("Error fetching supervisors", err);
      }
    };
    fetchSupervisors();

    if (projectToEdit) {
      // Si estamos editando, poblamos el formulario.
      // Es importante que los nombres de los campos coincidan.
      setFormData({
        nombre: projectToEdit.nombre,
        location: projectToEdit.location || '',
        fecha_inicio: projectToEdit.fecha_inicio.split('T')[0], // Formato YYYY-MM-DD para input date
        descripcion: projectToEdit.descripcion || '',
        manager: projectToEdit.supervisor?.toString() || '',
        estado: projectToEdit.estado,
      });
    } else {
      setFormData(initialFormData); // Limpiar para nuevo proyecto
    }
  }, [projectToEdit]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Validación básica de ejemplo
    if (!formData.nombre || !formData.fecha_inicio) {
        setError("El nombre del proyecto y la fecha de inicio son obligatorios.");
        setIsLoading(false);
        return;
    }

    try {
      if (projectToEdit && projectToEdit.id) {
        await updateProject(projectToEdit.id, formData);
      } else {
        await createProject(formData);
      }
      onSuccess(); // Llama a la función de éxito pasada por props
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message || 'Ocurrió un error al guardar el proyecto.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-lg">
          {projectToEdit ? 'Editar Proyecto' : 'Crear Nuevo Proyecto'}
        </h3>
        <button onClick={onCancel} className="p-2 hover:bg-gray-100 rounded-full">
          <XIcon size={20} className="text-gray-500" />
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 border border-red-200 rounded-md">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1">
              Nombre del Proyecto <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
            />
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
            />
          </div>
          <div>
            <label htmlFor="fecha_inicio" className="block text-sm font-medium text-gray-700 mb-1">
              Fecha de Inicio <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              id="fecha_inicio"
              name="fecha_inicio"
              value={formData.fecha_inicio}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
            />
          </div>
          <div>
            <label htmlFor="manager" className="block text-sm font-medium text-gray-700 mb-1">
              Supervisor de Proyecto
            </label>
            <select
              id="manager"
              name="manager"
              value={formData.manager}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              <option value="">Seleccionar Supervisor</option>
              {supervisors.map(sup => (
                <option key={sup.id} value={sup.id.toString()}>{sup.nombres}</option>
              ))}
              {/* Datos dummy mientras implementas la carga de supervisores */}
              <option value="1">Carlos Rodríguez (ID: 1)</option>
              <option value="2">Ana Martínez (ID: 2)</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label htmlFor="estado" className="block text-sm font-medium text-gray-700 mb-1">
              Estado del Proyecto
            </label>
            <select
              id="estado"
              name="estado"
              value={formData.estado}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              <option value="planificacion">Planificación</option>
              <option value="en_progreso">En Progreso</option>
              <option value="pausado">Pausado</option>
              <option value="finalizado">Finalizado</option>
              <option value="cancelado">Cancelado</option>
            </select>
          </div>
        </div>
        <div>
          <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700 mb-1">
            Descripción
          </label>
          <textarea
            id="descripcion"
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
          ></textarea>
        </div>
        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="flex items-center gap-2 bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700 disabled:bg-gray-500"
          >
            {isLoading ? <Loader2 size={16} className="animate-spin" /> : <SaveIcon size={16} />}
            <span>{projectToEdit ? 'Actualizar Proyecto' : 'Guardar Proyecto'}</span>
          </button>
        </div>
      </form>
      {/* La sección de "Asignar Personal" sigue aquí, podrías desarrollarla después */}
       <div className="mt-8 bg-gray-50 p-4 rounded-lg">
        <h3 className="font-semibold text-lg mb-2 text-gray-700">Asignar Personal</h3>
        <p className="text-sm text-gray-600 mb-3">
          {projectToEdit && projectToEdit.id ? 'Puedes asignar personal a este proyecto.' : 'Primero guarde el proyecto para poder asignar personal.'}
        </p>
        {/* Aquí iría la UI para asignar personal si el proyecto ya existe */}
      </div>
    </div>
  );
};