import apiClient from './apiClientes';

export interface Empleado {
  id?: number;
  nombres: string;
  cargo: number | string;
  cedula: string;
  fecha_contratacion?: string;
  telefono?: string;
  email?: string;
  estado?: number;
  fecha_creacion?: string;
  id_prestamo?: number;
  huella?: string;
  nivel_acceso?: number;
}

export interface EmpleadoFormData {
  nombres: string;
  cargo: number | string;
  cedula: string;
  telefono?: string;
  email?: string;
  huella?: string;
  // Agrega más campos según tu formulario
}

const PERSONNEL_ENDPOINT = '/empleados/';

export const getAllPersonnel = async (params?: Record<string, any>, idSupervisor?: number): Promise<Empleado[]> => {
  const queryParams = { ...params };
  if (idSupervisor) {
    queryParams.supervisor = idSupervisor;
  }
  const response = await apiClient.get<Empleado[]>(PERSONNEL_ENDPOINT, { params: queryParams });
  return response.data;
};

export const getPersonnelById = async (id: number): Promise<Empleado> => {
  const response = await apiClient.get<Empleado>(`${PERSONNEL_ENDPOINT}${id}/`);
  return response.data;
};

export const createPersonnel = async (data: EmpleadoFormData): Promise<Empleado> => {
  const payload = {
    ...data,
    cargo: typeof data.cargo === 'string' ? parseInt(data.cargo) : data.cargo,
  };
  const response = await apiClient.post<Empleado>(PERSONNEL_ENDPOINT, payload);
  return response.data;
};

export const updatePersonnel = async (id: number, data: Partial<EmpleadoFormData>): Promise<Empleado> => {
  const payload = {
    ...data,
    ...(data.cargo && { cargo: typeof data.cargo === 'string' ? parseInt(data.cargo) : data.cargo }),
  };
  const response = await apiClient.put<Empleado>(`${PERSONNEL_ENDPOINT}${id}/`, payload);
  return response.data;
};

export const deletePersonnel = async (id: number): Promise<void> => {
  await apiClient.delete(`${PERSONNEL_ENDPOINT}${id}/`);
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