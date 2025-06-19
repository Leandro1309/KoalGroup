import React, { useEffect, useState } from 'react';
import { Empleado, getAllPersonnel } from '../../../src/servicios/personnelService';


type ExitLog = {
  id: number;
  name: string;
  employeeId: string;
  timestampSalida: string;
  date: string;
  area: string;
};

type ExitLogTableProps = {
  logs?: any[];
};


export const ExitTable: React.FC<ExitLogTableProps> = ({logs}) => {
  const [exits, setExits] = useState<ExitLog[]>([]);
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
      .filter((item: any) => item.hora_salida)
      .map((item: any) => ({
        id: item.id ,
        name: item.empleadoNombre,
        employeeId: item.empleadoId?.toString() || '',
        timestampSalida: item.hora_salida ? formatTime(item.hora_salida) : '',
        date: formatDate(item.fecha),
        area: item.lugar_trabajo,
      }));
      setExits(mapped)
      setLoading(false)
      return;
    }
    

    // Si no hay logs, carga todos los registros de salida 
    getAllPersonnel().then(data => {
      const mapped = data
      .filter((item: any) => item.hora_salida)
      .map((item: any) => ({
        id: item.id, 
        name: item.empleadoNombre,
        employeeId: item.empleadoId?.toString() || '',
        timestampSalida: item.hora_salida ? formatTime(item.hora_salida) : '',
        date: formatDate(item.fecha),
        area: item.lugar_trabajo,
      }));
      setExits(mapped);
      setLoading(false);
    });
  },[logs]); 

  if (loading) return <div>Cargando salidas...</div>;

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
          {exits.map(exit =>
            <tr key={exit.id} className="hover:bg-gray-50">
              <td className="py-3 px-4">{exit.name}</td>
              <td className="py-3 px-4">{exit.employeeId}</td>
              <td className="py-3 px-4">{exit.timestampSalida}</td>
              <td className="py-3 px-4">{exit.date}</td>
              <td className="py-3 px-4">{exit.area}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};