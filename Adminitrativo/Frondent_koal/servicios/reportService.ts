import apiClient from './apiClientes';
import { ReportParams, ReportResult, Empleado, Proyecto } from '../types'; // Ajusta la ruta

// El endpoint real para generar y obtener informes dependerá de tu implementación en Django.
// Puede ser un solo endpoint que toma parámetros o varios.

// Ejemplo de función para generar/solicitar un informe
export const generateReport = async (params: ReportParams): Promise<ReportResult> => {
  try {
    // const response = await apiClient.post<ReportResult>('/reports/generate/', params);
    // return response.data;

    // --- SIMULACIÓN ---
    console.log('Simulating report generation with params:', params);
    await new Promise(resolve => setTimeout(resolve, 1000));
    return {
        id: `report_${Date.now()}`,
        name: `Informe de ${params.reportType} (${params.project || 'Todos'}) desde ${params.startDate} hasta ${params.endDate}`,
        url: `/api/administrativo/reports/download/report_${Date.now()}.pdf`, // URL simulada para descarga
        generatedDate: new Date().toISOString(),
        // data: [], // Si el informe también devuelve datos para mostrar en UI
    };
    // --- FIN SIMULACIÓN ---

  } catch (error) {
    console.error('Error generating report:', error);
    throw error;
  }
};

// Ejemplo de función para obtener informes "recientes" (lista de informes ya generados)
export const getRecentReports = async (limit: number = 5): Promise<ReportResult[]> => {
    try {
        // const response = await apiClient.get<ReportResult[]>(`/reports/recent/?limit=${limit}`);
        // return response.data;
        // --- SIMULACIÓN ---
        await new Promise(resolve => setTimeout(resolve, 300));
        return [
            { id: 1, name: 'Informe de Producción - Abril 2025', url: '#', generatedDate: '2025-05-01T10:00:00Z', data: [] },
            { id: 2, name: 'Informe de Personal - Mina Norte - Abril 2025', url: '#', generatedDate: '2025-05-02T11:00:00Z', data: [] },
        ];
        // --- FIN SIMULACIÓN ---
    } catch (error) {
        console.error('Error fetching recent reports:', error);
        throw error;
    }
}


// La función fetchEmpleados que tenías en Reports.tsx ahora iría aquí o en personnelService.ts
// Si es para popular un select en el formulario de reportes, podría ser parte de este servicio.
export const getEmployeesForReportFilter = async (): Promise<Pick<Empleado, 'id' | 'nombres'>[]> => {
    try {
        const response = await apiClient.get<Pick<Empleado, 'id' | 'nombres'>[]>('/empleados/?fields=id,nombres'); // Asumiendo que tu API soporta `fields`
        return response.data;
    } catch (error) {
        console.error('Error fetching employees for report filter:', error);
        throw error;
    }
};

export const getProjectsForReportFilter = async (): Promise<Pick<Proyecto, 'id' | 'nombre'>[]> => {
    try {
        const response = await apiClient.get<Pick<Proyecto, 'id' | 'nombre'>[]>('/proyectos/?fields=id,nombre');
        return response.data;
    } catch (error) {
        console.error('Error fetching projects for report filter:', error);
        throw error;
    }
};