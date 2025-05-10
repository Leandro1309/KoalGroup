import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { SearchIcon, PlusIcon, FileTextIcon, UserIcon, BarChart3Icon, XIcon, EditIcon, Trash2Icon } from 'lucide-react';
import { ProyectoAPI, ProyectoFormData, EmpleadoAPI } from '../types/index'; // Ajusta la ruta
import { ProjectForm } from './ProjectForm'; // Importar el formulario adaptado

const API_BASE_URL = 'http://127.0.0.1:8000/api/administrativo';

export const ProjectList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [projects, setProjects] = useState<ProyectoAPI[]>([]);
  const [currentProjectToEdit, setCurrentProjectToEdit] = useState<ProyectoAPI | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get<ProyectoAPI[]>(`${API_BASE_URL}/proyectos/`);
      setProjects(response.data);
    } catch (err) {
      console.error("Error fetching projects:", err);
      setError("No se pudieron cargar los proyectos.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleNewProjectClick = () => {
    setCurrentProjectToEdit(null); // Asegurarse que no hay proyecto para editar
    setShowForm(true);
  };

  const handleEditProject = (project: ProyectoAPI) => {
    setCurrentProjectToEdit(project);
    setShowForm(true);
  };

  const handleDeleteProject = async (projectId: number) => {
    if (window.confirm("¿Está seguro de que desea eliminar este proyecto?")) {
      setIsLoading(true);
      try {
        await axios.delete(`${API_BASE_URL}/proyectos/${projectId}/`);
        alert("Proyecto eliminado exitosamente.");
        fetchProjects(); // Recargar la lista
      } catch (err) {
        console.error("Error deleting project:", err);
        alert("Error al eliminar el proyecto.");
        setError("Error al eliminar el proyecto.");
      } finally {
        setIsLoading(false);
      }
    }
  };


  const handleProjectFormSuccess = (updatedOrNewProject: ProyectoAPI) => {
    setShowForm(false);
    setCurrentProjectToEdit(null);
    fetchProjects(); // Recargar la lista
  };

  const filteredProjects = projects.filter(project =>
    project.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (project.descripcion && project.descripcion.toLowerCase().includes(searchTerm.toLowerCase())) ||
    project.estado.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (project.supervisor_detalle && project.supervisor_detalle.nombres.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Proyectos</h2>
        <button onClick={handleNewProjectClick} className="flex items-center gap-2 bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors">
          <PlusIcon size={16} />
          <span>Nuevo Proyecto</span>
        </button>
      </div>

      {showForm && (
        // Usar el componente ProjectForm aquí
        <ProjectForm
            onProjectCreated={handleProjectFormSuccess}
            projectToEdit={currentProjectToEdit}
            onCloseForm={() => { setShowForm(false); setCurrentProjectToEdit(null);}}
        />
      )}

      <div className="relative mt-6">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <SearchIcon size={18} className="text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Buscar por nombre, descripción, estado, supervisor..."
          className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </div>

      {isLoading && <div className="text-center py-4">Cargando proyectos...</div>}
      {error && <div className="text-center py-4 text-red-600">{error}</div>}

      {!isLoading && !error && projects.length === 0 && (
        <div className="text-center py-10 text-gray-500">
          <FolderIcon size={48} className="mx-auto mb-2" />
          No hay proyectos registrados.
        </div>
      )}

      {!isLoading && !error && filteredProjects.length > 0 && (
        <div className="bg-white rounded-lg shadow-md overflow-x-auto mt-4 border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Supervisor</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha Inicio</th>
                {/* El campo 'location' no está en el modelo. Si lo añades, descomenta.
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ubicación</th>
                */}
                {/* El conteo de 'personal' no está directamente en el modelo Proyecto.
                    Necesitarías una agregación en el backend o calcularlo en el frontend si tienes los datos.
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Personal</th>
                */}
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProjects.map(project => (
                <tr key={project.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">{project.nombre}</div>
                    <div className="text-sm text-gray-500 truncate max-w-xs">{project.descripcion || '-'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {project.supervisor_detalle ? project.supervisor_detalle.nombres : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{new Date(project.fecha_inicio).toLocaleDateString()}</td>
                  {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{project.location || 'N/A'}</td> */}
                  {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{project.personnelCount || 0}</td> */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      project.estado === 'activo' || project.estado === 'en_progreso' ? 'bg-green-100 text-green-800' :
                      project.estado === 'finalizado' ? 'bg-blue-100 text-blue-800' :
                      project.estado === 'pausado' || project.estado === 'cancelado' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800' // para 'planificacion' u otros
                    }`}>
                      {project.estado}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 space-x-2">
                    {/* Botones de acción de ejemplo (tendrías que implementar la lógica) */}
                    <button onClick={() => handleEditProject(project)} title="Editar Proyecto" className="p-1.5 rounded-md hover:bg-yellow-100 text-yellow-600 hover:text-yellow-800 transition-colors">
                        <EditIcon size={18} />
                    </button>
                    <button onClick={() => handleDeleteProject(project.id)} title="Eliminar Proyecto" className="p-1.5 rounded-md hover:bg-red-100 text-red-500 hover:text-red-700 transition-colors">
                        <Trash2Icon size={18} />
                    </button>
                    <button title="Ver Detalles" className="p-1.5 rounded-md hover:bg-blue-100 text-blue-500 hover:text-blue-700 transition-colors">
                      <FileTextIcon size={18} />
                    </button>
                    {/*
                    <button title="Gestionar Personal" className="p-1 rounded-full hover:bg-gray-100">
                      <UserIcon size={18} className="text-gray-500" />
                    </button>
                    <button title="Ver Reportes del Proyecto" className="p-1 rounded-full hover:bg-gray-100">
                      <BarChart3Icon size={18} className="text-gray-500" />
                    </button>
                    */}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};