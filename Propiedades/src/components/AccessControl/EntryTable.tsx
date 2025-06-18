import React, { useEffect, useState } from 'react';
import { getAccessLogs } from '../../api/acces_control.api';


type EntryLog = {
  id: number;
  name: string;
  employeeId: string;
  timestampEntrada?: string;
  date: string;
  area: string;
};

type EntryLogTableProps = {
  logs?: any[];
};


export const EntryTable: React.FC<EntryLogTableProps> = ({logs}) => {
  const [entrys, setEntrys] = useState<EntryLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
     const formatTime = (hora: string) => {
      if (!hora) return '-';
      return hora.slice(0, 5);
    }; //Muestra la hora del backend local


    const formatDate = (fecha: string) => {
      if (!fecha) return '';
      const [year, month, day] = fecha.split('-');
      return `${day}/${month}/${year}`;
    };

    if(logs) {
      const mapped =logs
      .filter((item: any) => item.hora_entrada)
      .map((item: any) => ({
        id: item.id ,
        name: item.empleadoNombre,
        employeeId: item.empleadoId?.toString() || '',
        timestampEntrada: item.hora_entrada ? formatTime(item.hora_entrada) : '',
        date: formatDate(item.fecha),
        area: item.lugar_trabajo,
      }));
      setEntrys(mapped)
      setLoading(false)
      return;
    }
    

    // Si no hay logs, carga todos los registros de salida 
    getAccessLogs().then(data => {
      const mapped = data
      .filter((item: any) => item.hora_entrada)
      .map((item: any) => ({
        id: item.id, 
        name: item.empleadoNombre,
        employeeId: item.empleadoId?.toString() || '',
        timestampEntrada: item.hora_entrada ? formatTime(item.hora_entrada) : '',
        date: formatDate(item.fecha),
        area: item.lugar_trabajo,
      }));
      setEntrys(mapped);
      setLoading(false);
    });
  },[logs]); 


  if (loading) return <div>Cargando entradas...</div>;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead>
          <tr className="bg-gray-200 text-gray-700">
            <th className="py-3 px-4 text-left">Empleado</th>
            <th className="py-3 px-4 text-left">Cedula</th>
            <th className="py-3 px-4 text-left">Hora</th>
            <th className="py-3 px-4 text-left">Fecha</th>
            <th className="py-3 px-4 text-left">Área</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {entrys.map(entry =>
            <tr key={entry.id} className="hover:bg-gray-50">
              <td className="py-3 px-4">{entry.name}</td>
              <td className="py-3 px-4">{entry.employeeId}</td>
              <td className="py-3 px-4">{entry.timestampEntrada}</td>
              <td className="py-3 px-4">{entry.date}</td>
              <td className="py-3 px-4">{entry.area}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};