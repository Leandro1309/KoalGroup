import React, { useState } from 'react';
import { BarChart3Icon, Loader, DownloadIcon } from 'lucide-react';
import { reportService, Report } from '../services/api';

interface DateRange {
  start: string;
  end: string;
}

interface FormErrors {
  reportType?: string;
  project?: string;
  dateRange?: string;
}

export const Reports: React.FC = () => {
  const [reportType, setReportType] = useState('production');
  const [project, setProject] = useState('');
  const [dateRange, setDateRange] = useState<DateRange>({
    start: '',
    end: ''
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [report, setReport] = useState<Report | null>(null);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Validar tipo de reporte
    if (!reportType) {
      newErrors.reportType = 'Debe seleccionar un tipo de reporte';
    }

    // Validar fechas
    if (!dateRange.start || !dateRange.end) {
      newErrors.dateRange = 'Debe seleccionar un rango de fechas';
    } else {
      const startDate = new Date(dateRange.start);
      const endDate = new Date(dateRange.end);
      const today = new Date();

      if (startDate > endDate) {
        newErrors.dateRange = 'La fecha inicial no puede ser posterior a la fecha final';
      }
      if (endDate > today) {
        newErrors.dateRange = 'La fecha final no puede ser posterior a hoy';
      }
      if (endDate.getTime() - startDate.getTime() > 90 * 24 * 60 * 60 * 1000) {
        newErrors.dateRange = 'El rango de fechas no puede ser mayor a 90 días';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleGenerateReport = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setReport(null);

      const response = await reportService.generate({
        type: reportType,
        project: project || undefined,
        startDate: dateRange.start,
        endDate: dateRange.end
      });

      setReport(response.data);
    } catch (err) {
      console.error('Error al generar reporte:', err);
      setError('Error al generar el reporte');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!report) return;

    try {
      setLoading(true);
      const response = await reportService.download(report.id);
      
      // Crear un blob con la respuesta
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      
      // Crear un enlace temporal y hacer clic en él
      const link = document.createElement('a');
      link.href = url;
      link.download = `reporte_${report.type}_${dateRange.start}_${dateRange.end}.pdf`;
      document.body.appendChild(link);
      link.click();
      
      // Limpiar
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error al descargar reporte:', err);
      setError('Error al descargar el reporte');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Reportes</h2>
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
          {error}
        </div>
      )}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="space-y-4">
          <div>
            <label htmlFor="reportType" className="block text-sm font-medium text-gray-700 mb-1">
              Tipo de Informe
            </label>
            <select
              id="reportType"
              value={reportType}
              onChange={e => {
                setReportType(e.target.value);
                if (errors.reportType) {
                  setErrors(prev => ({ ...prev, reportType: undefined }));
                }
              }}
              disabled={loading}
              className={`w-full px-3 py-2 border ${errors.reportType ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500`}
            >
              <option value="production">Producción</option>
              <option value="personnel">Ingreso y Salida</option>
              <option value="project">Empleados</option>
            </select>
            {errors.reportType && <p className="mt-1 text-sm text-red-600">{errors.reportType}</p>}
          </div>
          <div>
            <label htmlFor="project" className="block text-sm font-medium text-gray-700 mb-1">
              Proyecto
            </label>
            <select
              id="project"
              value={project}
              onChange={e => {
                setProject(e.target.value);
                if (errors.project) {
                  setErrors(prev => ({ ...prev, project: undefined }));
                }
              }}
              disabled={loading}
              className={`w-full px-3 py-2 border ${errors.project ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500`}
            >
              <option value="">Todos los Proyectos</option>
              <option value="1">Mina Norte</option>
              <option value="2">Proyecto Sur</option>
              <option value="3">Excavación Este</option>
              <option value="4">Mina Occidental</option>
              <option value="5">Proyecto Central</option>
            </select>
            {errors.project && <p className="mt-1 text-sm text-red-600">{errors.project}</p>}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                Fecha Inicial
              </label>
              <input
                type="date"
                id="startDate"
                value={dateRange.start}
                onChange={e => {
                  setDateRange(prev => ({
                    ...prev,
                    start: e.target.value
                  }));
                  if (errors.dateRange) {
                    setErrors(prev => ({ ...prev, dateRange: undefined }));
                  }
                }}
                disabled={loading}
                className={`w-full px-3 py-2 border ${errors.dateRange ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500`}
              />
            </div>
            <div>
              <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
                Fecha Final
              </label>
              <input
                type="date"
                id="endDate"
                value={dateRange.end}
                onChange={e => {
                  setDateRange(prev => ({
                    ...prev,
                    end: e.target.value
                  }));
                  if (errors.dateRange) {
                    setErrors(prev => ({ ...prev, dateRange: undefined }));
                  }
                }}
                disabled={loading}
                className={`w-full px-3 py-2 border ${errors.dateRange ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500`}
              />
            </div>
          </div>
          {errors.dateRange && <p className="mt-1 text-sm text-red-600">{errors.dateRange}</p>}
          <div className="pt-2 flex gap-2">
            <button
              onClick={handleGenerateReport}
              disabled={loading}
              className={`flex items-center gap-2 bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700 ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {loading ? (
                <>
                  <Loader className="animate-spin" size={16} />
                  <span>Generando...</span>
                </>
              ) : (
                <>
                  <BarChart3Icon size={16} />
                  <span>Generar Informe</span>
                </>
              )}
            </button>
            {report && (
              <button
                onClick={handleDownload}
                disabled={loading}
                className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                <DownloadIcon size={16} />
                <span>Descargar PDF</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};