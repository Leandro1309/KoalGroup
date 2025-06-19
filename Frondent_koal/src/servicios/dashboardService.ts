import apiClient from './apiClientes';
import { DashboardStatsAPI, ProyectoResumidoAPI, ProduccionPorProyectoAPI } from '../types'; // Ajusta la ruta

// Asumiendo endpoints específicos para estos datos o que se componen de varias llamadas.
// Si no tienes un endpoint único para todas las stats del dashboard, tendrás que hacer varias llamadas.

// Ejemplo: Si tienes un endpoint consolidado para las tarjetas de estadísticas
export const getDashboardStats = async (): Promise<DashboardStatsAPI> => {
  try {
    // Si tienes un endpoint específico, por ejemplo /dashboard/stats/
    // const response = await apiClient.get<DashboardStatsAPI>('/dashboard/stats/');
    // return response.data;

    // --- SIMULACIÓN SI NO TIENES ENDPOINT ---
    // Esto debería reemplazarse por llamadas reales.
    // Podrías llamar a projectService.getAllProjects({estado: 'activo', limit: 0}) para contar,
    // y a personnelService.getAllPersonnel({limit: 0}) para contar.
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      proyectos_activos: 5, // Calcular desde API de proyectos
      total_personal: 25,   // Calcular desde API de personal
      produccion_mensual_estimada: "850 t", // Esto necesitaría un cálculo/endpoint específico
      informes_generados: 7 // Esto también
    };
    // --- FIN SIMULACIÓN ---
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    throw error;
  }
};

// Para proyectos recientes, ya tienes projectService. Usa eso.
// Esta función es solo un alias si quieres mantenerlo separado lógicamente aquí.
// import { getAllProjects } from './projectService';
// export const getRecentProjects = async (limit: number = 5): Promise<ProyectoResumidoAPI[]> => {
//   return getAllProjects({ limit, ordering: '-fecha_creacion' }); // Asume que getAllProjects devuelve el formato correcto
// };


// Para producción por proyecto (esto probablemente necesita su propio endpoint en el backend)
export const getProductionByProject = async (): Promise<ProduccionPorProyectoAPI[]> => {
    try {
        // const response = await apiClient.get<ProduccionPorProyectoAPI[]>('/dashboard/production-by-project/');
        // return response.data;

        // --- SIMULACIÓN ---
        await new Promise(resolve => setTimeout(resolve, 500));
        return [
            { id: 1, nombre_proyecto: "Mina Norte", porcentaje_produccion: 45 },
            { id: 2, nombre_proyecto: "Proyecto Sur", porcentaje_produccion: 30 },
            { id: 3, nombre_proyecto: "Excavación Este", porcentaje_produccion: 25 },
        ];
        // --- FIN SIMULACIÓN ---
    } catch (error) {
        console.error('Error fetching production by project:', error);
        throw error;
    }
};