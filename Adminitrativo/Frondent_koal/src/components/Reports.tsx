import React, { useState, useEffect, useCallback } from 'react';
import { DownloadIcon, BarChart3Icon, PieChartIcon, UserIcon as UserLucideIcon, FolderIcon, Loader2 } from 'lucide-react';
import { generateReport, getRecentReports, getProjectsForReportFilter } from '../services/reportService'; // Asumiendo que fetchEmpleados se mueve o se llama diferente
import { ReportParams, ReportResult, Proyecto } from '../types/index'; // Ajusta la ruta

export const Reports: React.FC = () => {
  const [reportType, setReportType] = useState('production');
  const [projectId, setProjectId] = useState(''); // Almacenar ID del proyecto
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  const [projectsForFilter, setProjectsForFilter] = useState<Pick<Proyecto, 'id' | 'nombre'>[]>([]);
  const [recentReports, setRecentReports] = useState<ReportResult[]>([]);
  const [isLoading, setIsLoading] = useState(false); // Para la generación
  const [isListLoading, setIsListLoading] = useState(true); // Para la lista de recientes
  const [error, setError] = useState<string | null>(null);
  const [generatedReportInfo, setGeneratedReportInfo] = useState<ReportResult | null>(null);


  const fetchFilterData = useCallback(async () => {
      try {
          const projectsData = await getProjectsForReportFilter();
          setProjectsForFilter(projectsData);
          // Cargar otros datos de filtro si es necesario (ej. empleados)
      } catch (err) {
          console.error("Error loading filter data for reports", err);
          // Manejar error si es crítico para la UI
      }
  }, []);

  const fetchRecent = useCallback(async () => {
      setIsListLoading(true);
      try {
          const reports = await getRecentReports();
          setRecentReports(reports);
      } catch (err) {
          console.error("Error fetching recent reports", err);
          setError("No se pudieron cargar los informes recientes.");
      } finally {
          setIsListLoading(false);
      }
  }, []);

  useEffect(() => {
      fetchFilterData();
      fetchRecent();
  }, [fetchFilterData, fetchRecent]);


  const handleGenerateReport = async () => {
    setIsLoading(true);
    setError(null);
    setGeneratedReportInfo(null);

    const params: ReportParams = {
      reportType,
      project: projectId || undefined, // Enviar solo si hay un proyecto seleccionado
      startDate: dateRange.start || undefined,
      endDate: dateRange.end || undefined,
    };

    try {
      const result = await generateReport(params);
      setGeneratedReportInfo(result);
      // Opcionalmente, refrescar la lista de informes recientes si la generación añade a la lista
      fetchRecent();
      // Mostrar un toast de éxito
    } catch (err: any) {
      setError(err.message || 'Error al generar el informe.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadReport = (url?: string) => {
      if (url) {
          // Si la URL es relativa a la API_BASE_URL y no absoluta:
          // window.open(`${apiClient.defaults.baseURL}${url}`, '_blank');
          // Si la URL ya es absoluta:
          window.open(url, '_blank');
      } else {
          alert("No hay URL de descarga disponible para este informe.");
      }
  };

  return (
    <div className="space-y-6 p-4 md:p-6">
      <h2 className="text-2xl font-bold text-gray-800">Informes</h2>

      {error && (
        <div className="my-4 p-3 bg-red-50 text-red-700 border border-red-200 rounded-md">
          {error}
        </div>
      )}

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="font-semibold text-lg mb-4">Generar Informe</h3>
        <div className="space-y-4">
          <div>
            <label htmlFor="reportType" className="block text-sm font-medium text-gray-700 mb-1">Tipo de Informe</label>
            <select id="reportType" value={reportType} onChange={e => setReportType(e.target.value)} className="w-full input-class">
              <option value="production">Producción</option>
              <option value="personnel_attendance">Ingreso y Salida Personal</option>
              <option value="employee_list">Listado de Empleados</option>
              {/* Añadir más tipos según tus necesidades */}
            </select>
          </div>
          <div>
            <label htmlFor="project" className="block text-sm font-medium text-gray-700 mb-1">Proyecto</label>
            <select id="project" value={projectId} onChange={e => setProjectId(e.target.value)} className="w-full input-class">
              <option value="">Todos los Proyectos</option>
              {projectsForFilter.map(p => (
                  <option key={p.id} value={p.id.toString()}>{p.nombre}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">Fecha Inicial</label>
              <input type="date" id="startDate" value={dateRange.start} onChange={e => setDateRange(prev => ({ ...prev, start: e.target.value }))} className="w-full input-class" />
            </div>
            <div>
              <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">Fecha Final</label>
              <input type="date" id="endDate" value={dateRange.end} onChange={e => setDateRange(prev => ({ ...prev, end: e.target.value }))} className="w-full input-class" />
            </div>
          </div>
          <div className="pt-2">
            <button onClick={handleGenerateReport} disabled={isLoading} className="btn-primary">
              {isLoading ? <Loader2 size={16} className="animate-spin" /> : <BarChart3Icon size={16} />}
              <span>Generar Informe</span>
            </button>
          </div>
        </div>
        {generatedReportInfo && (
            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-md">
                <h4 className="font-semibold text-green-800">Informe Generado:</h4>
                <p className="text-sm text-green-700">{generatedReportInfo.name}</p>
                {generatedReportInfo.url && (
                    <button
                        onClick={() => handleDownloadReport(generatedReportInfo.url)}
                        className="mt-2 flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 underline"
                    >
                        <DownloadIcon size={14} /> Descargar
                    </button>
                )}
            </div>
        )}
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="font-semibold text-lg mb-4">Informes Recientes</h3>
        {isListLoading && <div className="flex justify-center p-4"><Loader2 size={24} className="animate-spin" /></div>}
        {!isListLoading && recentReports.length === 0 && <p className="text-gray-500">No hay informes recientes.</p>}
        {!isListLoading && recentReports.length > 0 && (
            <div className="space-y-3">
            {recentReports.map(report => (
                <div key={report.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-md border border-gray-100">
                <div className="flex items-center">
                    {/* Icono según tipo (simplificado) */}
                    {report.name.toLowerCase().includes('producción') ? <BarChart3Icon size={20} className="text-gray-500 mr-3" /> :
                    report.name.toLowerCase().includes('personal') ? <UserLucideIcon size={20} className="text-gray-500 mr-3" /> :
                    <FolderIcon size={20} className="text-gray-500 mr-3" />}
                    <div>
                    <p className="font-medium">{report.name}</p>
                    <p className="text-sm text-gray-500">
                        Generado el {new Date(report.generatedDate).toLocaleDateString()}
                    </p>
                    </div>
                </div>
                {report.url && (
                    <button onClick={() => handleDownloadReport(report.url)} className="flex items-center gap-1 text-gray-700 hover:text-gray-900">
                    <DownloadIcon size={16} />
                    <span className="text-sm">Descargar</span>
                    </button>
                )}
                </div>
            ))}
            </div>
        )}
      </div>
    </div>
  );
};

// Recuerda definir .input-class, .btn-primary en tu CSS global.