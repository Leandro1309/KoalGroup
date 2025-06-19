import React from 'react';
export const AccessLogTable: React.FC = () => {
  // Mock data for the table
  const accessLogs = [{
    id: 1,
    name: 'Carlos Rodríguez',
    employeeId: 'E-1023',
    type: 'Entrada',
    timestamp: '08:15 AM',
    date: '15/05/2023',
    area: 'Mina Norte'
  }, {
    id: 2,
    name: 'María González',
    employeeId: 'E-1045',
    type: 'Entrada',
    timestamp: '08:22 AM',
    date: '15/05/2023',
    area: 'Procesamiento'
  }, {
    id: 3,
    name: 'Juan Pérez',
    employeeId: 'E-1012',
    type: 'Salida',
    timestamp: '16:05 PM',
    date: '15/05/2023',
    area: 'Mina Sur'
  }, {
    id: 4,
    name: 'Ana López',
    employeeId: 'E-1067',
    type: 'Entrada',
    timestamp: '08:00 AM',
    date: '15/05/2023',
    area: 'Administración'
  }, {
    id: 5,
    name: 'Roberto Díaz',
    employeeId: 'E-1034',
    type: 'Salida',
    timestamp: '16:30 PM',
    date: '15/05/2023',
    area: 'Mina Norte'
  }];
  return <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead>
          <tr className="bg-gray-200 text-gray-700">
            <th className="py-3 px-4 text-left">Empleado</th>
            <th className="py-3 px-4 text-left">ID</th>
            <th className="py-3 px-4 text-left">Tipo</th>
            <th className="py-3 px-4 text-left">Hora</th>
            <th className="py-3 px-4 text-left">Fecha</th>
            <th className="py-3 px-4 text-left">Área</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {accessLogs.map(log => <tr key={log.id} className="hover:bg-gray-50">
              <td className="py-3 px-4">{log.name}</td>
              <td className="py-3 px-4">{log.employeeId}</td>
              <td className="py-3 px-4">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${log.type === 'Entrada' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {log.type}
                </span>
              </td>
              <td className="py-3 px-4">{log.timestamp}</td>
              <td className="py-3 px-4">{log.date}</td>
              <td className="py-3 px-4">{log.area}</td>
            </tr>)}
        </tbody>
      </table>
    </div>;
};