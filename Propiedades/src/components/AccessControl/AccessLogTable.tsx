import React, { useEffect, useState } from 'react';
import { getAccessLogs, deleteAccessLog } from '../../api/acces_control.api';

type AccessLog = {
  id: number;
  name: string;
  employeeId: string;
  timestampEntrada?: string;
  timestampSalida?: string;
  date: string;
  area: string;
};

type AccessLogTableProps = {
  logs?: any[];
}

export const AccessLogTable: React.FC<AccessLogTableProps> = ({logs}) => {
  const [accessLogs, setAccessLogs] = useState<AccessLog[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Función para eliminar un registro
  const handleDelete = async (logId: number) => {
    try {
      await deleteAccessLog(logId);
      setAccessLogs(prev => prev.filter(log => log.id !== logId));
    } catch (error) {
      alert('Error al eliminar el registro');
    }
  };
/**
   * Efecto que obtiene los registros de acceso desde el backend al montar el componente.
   * 
   * - Llama a la función getAccessLogs() para obtener los datos.
   * - Formatea la fecha de cada registro de 'YYYY-MM-DD' a 'DD/MM/YYYY'.
   * - Formatea la hora de entrada y salida para mostrar solo 'HH:MM'.
   * - Actualiza el estado accessLogs con los registros formateados.
   * - Maneja el estado de carga (loading) para mostrar un mensaje mientras se obtienen los datos.
   * 
   * Notas:
   * - No se utiliza el objeto Date de JavaScript para evitar problemas de zona horaria,
   *   ya que la fecha y hora ya vienen en formato local desde el backend.
   * - Si ocurre un error al obtener los datos, se oculta el mensaje de carga.
   */
  
  useEffect(() =>{
    // Si recibimos logs como prop, los usamos directamente
    if (logs) {
      const formatDate =(fecha: string) => {
        if (!fecha) return '';
        const [year,month, day] = fecha.split('-');
        return `${day}/${month}/${year}`;
      };
      const formatTime = (hora: string) => {
        if (!hora) return '-';
        return hora.slice(0,5);
      };
      const mapped = logs.map((item:any) => ({
        id: item.id,
        name: item.empleadoNombre,
        employeeId: item.empleadoId?.toString() ||  item.empleadoId?.toString() || '',
        timestampEntrada : item.hora_entrada ? formatTime(item.hora_entrada) : '',
        timestampSalida : item.hora_salida ? formatTime(item.hora_salida) : '',
        date: formatDate(item.fecha),
        area: item.lugar_trabajo
      }));
      setAccessLogs(mapped);
      setLoading(false);
      return;
    }

    // Si no hay logs como prop , carga todos 

    getAccessLogs().then(data => {
      const formatDate =  (fecha: string) => {
        if (!fecha) return '';
        const [year, month, day] = fecha.split('-');
        return `${day}/${month}/${year}`;
      };

      const formatTime = (hora: string) => {
        if (!hora) return '-';
        return hora.slice(0, 5);
      };

      const logs: AccessLog[] = data.map((item: any) => ({
        id: item.id,
        name: item.empleadoNombre,
        employeeId: item.empleadoId.toString(),
        timestampEntrada : item.hora_entrada ? formatTime(item.hora_entrada) : '',
        timestampSalida : item.hora_salida ? formatTime(item.hora_salida) : '',
        date: formatDate(item.fecha),
        area: item.lugar_trabajo
      }));
      setAccessLogs(logs);
      setLoading(false);
    }).catch(() => setLoading(false));
   }, [logs]);

   if(loading) {
    return <div> Cargando registros...</div>
   }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead>
          <tr className="bg-gray-200 text-gray-700">
            <th className="py-3 px-4 text-left">Empleado</th>
            <th className="py-3 px-4 text-left">Cedula</th>
            <th className="py-3 px-4 text-left">Hora Entrada / Salida</th>
            <th className="py-3 px-4 text-left">Fecha</th>
            <th className="py-3 px-4 text-left">Área</th>
            <th className="py-3 px-4 text-left">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {accessLogs.map(log =>
            <tr key={log.id} className="hover:bg-gray-50">
              <td className="py-3 px-4">{log.name}</td>
              <td className="py-3 px-4">{log.employeeId}</td>
              <td className="py-3 px-4">
                <div>
                  <span className="font-semibold">Entrada:</span> {log.timestampEntrada || '-'}
                </div>
                <div>
                  <span className="font-semibold">Salida:</span> {log.timestampSalida || '-'}
                </div>
              </td>
              <td className="py-3 px-4">{log.date}</td>
              <td className="py-3 px-4">{log.area}</td>
              <td className="py-3 px-4">
                <button
                  onClick={() => handleDelete(log.id)}
                  title="Eliminar"
                  className="text-red-600 hover:text-red-800"
                >
                  <svg width="24" height="24" fill="none" stroke="red" strokeWidth="2" viewBox="0 0 24 24">
                    <rect x="5" y="7" width="14" height="12" rx="2" stroke="red" strokeWidth="2"/>
                    <path d="M9 10v6M12 10v6M15 10v6" stroke="red" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M3 7h18M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" stroke="red" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </button>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};



