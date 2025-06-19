import apiClient from './apiClientes';

export interface Supervisor {
  id?: number;
  nombre: string;
  area: string;
  turno: string;
  // Agrega más campos según tu modelo
}

const SUPERVISOR_ENDPOINT = '/supervisores/';

export const getAllSupervisors = async (params?: Record<string, any>): Promise<Supervisor[]> => {
  try {
    const response = await apiClient.get<Supervisor[]>(SUPERVISOR_ENDPOINT, { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching supervisors:', error);
    throw error;
  }
};

export const getSupervisorById = async (id: number): Promise<Supervisor> => {
  try {
    const response = await apiClient.get<Supervisor>(`${SUPERVISOR_ENDPOINT}${id}/`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching supervisor with id ${id}:`, error);
    throw error;
  }
};

export const createSupervisor = async (data: Supervisor): Promise<Supervisor> => {
  try {
    const response = await apiClient.post<Supervisor>(SUPERVISOR_ENDPOINT, data);
    return response.data;
  } catch (error) {
    console.error('Error creating supervisor:', error);
    throw error;
  }
};

export const updateSupervisor = async (id: number, data: Partial<Supervisor>): Promise<Supervisor> => {
  try {
    const response = await apiClient.put<Supervisor>(`${SUPERVISOR_ENDPOINT}${id}/`, data);
    return response.data;
  } catch (error) {
    console.error(`Error updating supervisor with id ${id}:`, error);
    throw error;
  }
};

export const deleteSupervisor = async (id: number): Promise<void> => {
  try {
    await apiClient.delete(`${SUPERVISOR_ENDPOINT}${id}/`);
  } catch (error) {
    console.error(`Error deleting supervisor with id ${id}:`, error);
    throw error;
  }
};