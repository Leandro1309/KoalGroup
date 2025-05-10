import apiClient from './apiClientes';
import { Empleado, EmpleadoFormData } from '../types'; // Ajusta la ruta

const PERSONNEL_ENDPOINT = '/empleados/'; // Basado en tu models.py, el serializer es EmpleadoSerializer

export const getAllPersonnel = async (params?: Record<string, any>): Promise<Empleado[]> => {
  try {
    const response = await apiClient.get<Empleado[]>(PERSONNEL_ENDPOINT, { params });
    // Si tu API devuelve un objeto con 'results' (común en DRF con paginación)
    // return (response.data as any).results || response.data;
    return response.data;
  } catch (error) {
    console.error('Error fetching personnel:', error);
    throw error;
  }
};

export const getPersonnelById = async (id: number): Promise<Empleado> => {
  try {
    const response = await apiClient.get<Empleado>(`${PERSONNEL_ENDPOINT}${id}/`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching personnel with id ${id}:`, error);
    throw error;
  }
};

export const createPersonnel = async (data: EmpleadoFormData): Promise<Empleado> => {
  try {
    // Asegúrate que 'data' coincida con EmpleadoSerializer
    const payload = {
        ...data,
        cargo: typeof data.cargo === 'string' ? parseInt(data.cargo) : data.cargo,
        // email: data.email || null, // El backend podría requerir null para emails opcionales vacíos
        // telefono: data.telefono || null,
    };
    const response = await apiClient.post<Empleado>(PERSONNEL_ENDPOINT, payload);
    return response.data;
  } catch (error) {
    console.error('Error creating personnel:', error);
    throw error;
  }
};

export const updatePersonnel = async (id: number, data: Partial<EmpleadoFormData>): Promise<Empleado> => {
  try {
     const payload = {
        ...data,
        // Si el cargo se envía como string, convertirlo a número
        ...(data.cargo && { cargo: typeof data.cargo === 'string' ? parseInt(data.cargo) : data.cargo }),
    };
    const response = await apiClient.put<Empleado>(`${PERSONNEL_ENDPOINT}${id}/`, payload);
    return response.data;
  } catch (error) {
    console.error(`Error updating personnel with id ${id}:`, error);
    throw error;
  }
};

export const deletePersonnel = async (id: number): Promise<void> => {
  try {
    await apiClient.delete(`${PERSONNEL_ENDPOINT}${id}/`);
  } catch (error) {
    console.error(`Error deleting personnel with id ${id}:`, error);
    throw error;
  }
};

// Simulación de escaneo de huella. En un caso real, esto podría ser
// una llamada a un endpoint que interactúa con hardware.
export const scanFingerprintAPI = async (userId?: string): Promise<{ fingerprintId: string }> => {
    console.log('Simulating fingerprint scan for user:', userId);
    // --- SIMULACIÓN DE LLAMADA AL BACKEND ---
    await new Promise(resolve => setTimeout(resolve, 1500));
    const success = Math.random() > 0.2; // 80% probabilidad de éxito

    if (success) {
        return { fingerprintId: `fingerprint_scan_${Date.now()}` };
    } else {
        throw new Error('No se pudo capturar la huella. Intente de nuevo.');
    }
    // --- FIN SIMULACIÓN ---
};