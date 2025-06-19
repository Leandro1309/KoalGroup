import apiClient from './apiClientes';
import { Proyecto, ProyectoFormData } from '../types'; // Ajusta la ruta a tu archivo de tipos
import { useAuth } from '../auth/AuthContext';

const PROJECT_ENDPOINT = '/proyectos/'; // Endpoint específico para proyectos

export const getAllProjects = async (params?: Record<string, any>, idSupervisor?: number): Promise<Proyecto[]> => {
  try {
    const queryParams = { ...params };
    if (idSupervisor) {
      queryParams.supervisor = idSupervisor;
    }
    const response = await apiClient.get<Proyecto[]>(PROJECT_ENDPOINT, { params: queryParams });
    return response.data;
  } catch (error) {
    console.error('Error fetching projects:', error);
    throw error; // Re-lanzar para que el componente pueda manejarlo
  }
};

export const getProjectById = async (id: number): Promise<Proyecto> => {
  try {
    const response = await apiClient.get<Proyecto>(`${PROJECT_ENDPOINT}${id}/`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching project with id ${id}:`, error);
    throw error;
  }
};

export const createProject = async (data: ProyectoFormData): Promise<Proyecto> => {
  try {
    // Asegúrate que 'data' coincida con lo que espera tu ProyectoSerializer en Django
    // Por ejemplo, si 'manager' en el form es 'supervisor' en el backend y es un ID:
    const payload = {
        ...data,
        supervisor: data.manager ? parseInt(data.manager, 10) : null,
        // location: data.location, // Si el backend espera 'location'
    };
    // delete payload.manager; // Elimina el campo si no es parte del backend
    const response = await apiClient.post<Proyecto>(PROJECT_ENDPOINT, payload);
    return response.data;
  } catch (error) {
    console.error('Error creating project:', error);
    throw error;
  }
};

export const updateProject = async (id: number, data: Partial<ProyectoFormData>): Promise<Proyecto> => {
  try {
    const payload = { ...data };
    if (data.manager) {
        (payload as any).supervisor = parseInt(data.manager, 10);
        // delete payload.manager;
    }
    const response = await apiClient.put<Proyecto>(`${PROJECT_ENDPOINT}${id}/`, payload);
    return response.data;
  } catch (error) {
    console.error(`Error updating project with id ${id}:`, error);
    throw error;
  }
};

export const deleteProject = async (id: number): Promise<void> => {
  try {
    await apiClient.delete(`${PROJECT_ENDPOINT}${id}/`);
  } catch (error) {
    console.error(`Error deleting project with id ${id}:`, error);
    throw error;
  }
};