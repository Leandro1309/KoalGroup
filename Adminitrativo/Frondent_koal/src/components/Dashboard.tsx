import React, { useState, useEffect, useCallback } from 'react';
import { BarChart3Icon, UsersIcon, FolderIcon, FileTextIcon, Loader2 as LoaderIcon } from 'lucide-react'; // Usando Loader2
import { getDashboardStats, getProductionByProject } from  "../servicios/projectService";
import { getAllProjects } from '../servicios/projectService'; // Para proyectos recientes
import { DashboardStatsAPI, ProyectoResumidoAPI, ProduccionPorProyectoAPI, Proyecto } from '../types/index'; // Ajusta la ruta

// Tipos para el estado interno del componente Dashboard (pueden ser diferentes de los tipos API si hay transformación)
interface DashboardStatsView {
  proyectosActivos: string;
  totalPersonal: string;
  produccionMensualEstimada: string;
  informesGenerados: string;
}

export const Dashboard: React.FC = () => {
  const [statsView, setStatsView] = useState<DashboardStatsView | null>(null);
  const [proyectosRecientes, setProyectosRecientes] = useState<ProyectoResumidoAPI[]>([]);
  const [produccionDataView, setProduccionDataView] = useState<ProduccionPorProyectoAPI[]>([]); // Usamos el tipo API directamente
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Realizar todas las llamadas en paralelo para mejorar la carga
      const [statsData, proyectosData, produccionRawData] = await Promise.all([
        getDashboardStats(),
        getAllProjects({ limit: 5, ordering: '-fecha_creacion' }), // Asume que este endpoint existe y funciona
        getProductionByProject()
      ]);

      // Mapear datos de API a datos de vista si es necesario
      setStatsView({
        proyectosActivos: statsData.proyectos_activos.toString(),
        totalPersonal: statsData.total_personal.toString(),
        produccionMensualEstimada: statsData.produccion_mensual_estimada,
        informesGenerados: statsData.informes_generados.toString(),
      });

      // Proyectos recientes: Asumiendo que getAllProjects devuelve el tipo Proyecto completo,
      // y necesitamos adaptarlo a ProyectoResumidoAPI si es diferente.
      // Si getAllProjects ya devuelve el formato ProyectoResumidoAPI, no necesitas mapear.
      setProyectosRecientes(proyectosData.map((p: Proyecto) => ({ // Asegúrate que 'Proyecto' sea el tipo correcto devuelto por getAllProjects
          id: p.id,
          nombre: p.nombre,
          estado: p.estado
      })));

      setProduccionDataView(produccionRawData.map(p => ({
          id: p.id,
          nombre_proyecto: p.nombre_proyecto, // Asegúrate que el nombre del campo coincida
          porcentaje_produccion: p.porcentaje_produccion // Asegúrate que el nombre del campo coincida
      })));

    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setError("No se pudieron cargar los datos del panel principal.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  if (isLoading) {
    return <div className="flex justify-center items-center h-64"><LoaderIcon size={48} className="animate-spin text-gray-500" /> Cargando panel...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-600 bg-red-50 p-4 rounded-md">{error}</div>;
  }

  return (
    <div className="space-y-6 p-4 md:p-6">
      <h2 className="text-2xl font-bold text-gray-800">Panel Principal</h2>

      {/* Tarjetas de Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard title="Proyectos Activos" value={statsView?.proyectosActivos || 'N/A'} icon={<FolderIcon />} />
        <DashboardCard title="Personal Total" value={statsView?.totalPersonal || 'N/A'} icon={<UsersIcon />} />
        <DashboardCard title="Producción Mensual (Est.)" value={statsView?.produccionMensualEstimada || 'N/A'} icon={<BarChart3Icon />} />
        <DashboardCard title="Informes Generados" value={statsView?.informesGenerados || 'N/A'} icon={<FileTextIcon />} />
      </div>

      {/* Secciones de Listas/Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h3 className="font-semibold text-lg mb-4 text-gray-700">Proyectos Recientes</h3>
          {proyectosRecientes.length > 0 ? (
            <div className="space-y-3">
              {proyectosRecientes.map(p => (
                <div key={p.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-md border border-gray-100 transition-colors">
                  <div>
                    <p className="font-medium text-gray-800">{p.nombre}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
                      p.estado === 'activo' || p.estado === 'en_progreso' ? 'bg-green-100 text-green-700' :
                      p.estado === 'finalizado' ? 'bg-blue-100 text-blue-700' :
                      p.estado === 'planificacion' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-gray-100 text-gray-700' // Otros estados
                  }`}>
                    {p.estado.replace('_', ' ')} {/* Formatear estado si es necesario */}
                  </span>
                </div>
              ))}
            </div>
          ) : <p className="text-gray-500">No hay proyectos recientes para mostrar.</p>}
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h3 className="font-semibold text-lg mb-4 text-gray-700">Producción Estimada por Proyecto</h3>
          {produccionDataView.length > 0 ? (
            <div className="space-y-4">
              {produccionDataView.map(item => (
                <div key={item.id}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-800">{item.nombre_proyecto}</span>
                    <span className="text-sm text-gray-600">{item.porcentaje_produccion}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-gray-700 h-2.5 rounded-full" style={{ width: `${item.porcentaje_produccion}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          ) : <p className="text-gray-500">No hay datos de producción disponibles.</p>}
        </div>
      </div>
    </div>
  );
};

// Componente auxiliar para las tarjetas del dashboard (sin cambios)
interface DashboardCardProps { title: string; value: string; icon: React.ReactNode; }
const DashboardCard: React.FC<DashboardCardProps> = ({ title, value, icon }) => (
  <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 transform hover:scale-105 transition-transform duration-200">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-500 text-sm">{title}</p>
        <p className="text-3xl font-semibold mt-1 text-gray-800">{value}</p>
      </div>
      <div className="bg-gray-100 p-3 rounded-full text-gray-600">
        {React.isValidElement(icon) ? React.cloneElement(icon, { size: 24 }) : icon}
      </div>
    </div>
  </div>
);