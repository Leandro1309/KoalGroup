import React, { useState } from 'react';
import { PlusIcon, AlertTriangleIcon, FilterIcon } from 'lucide-react';
import { GasRegistryForm } from './GasRegistryForm';
export const GasRegistryPanel: React.FC = () => {
  const [showGasForm, setShowGasForm] = useState(false);
  // Mock gas registry data
  const gasRecords = [{
    id: 1,
    date: '15/05/2023',
    time: '09:30 AM',
    location: 'Mina Norte - Sección A',
    gasType: 'Metano (CH₄)',
    level: '2.5%',
    status: 'Normal',
    recordedBy: 'J. Martínez'
  }, {
    id: 2,
    date: '15/05/2023',
    time: '10:15 AM',
    location: 'Mina Sur - Sección B',
    gasType: 'Monóxido de Carbono (CO)',
    level: '35 ppm',
    status: 'Advertencia',
    recordedBy: 'A. Gómez'
  }, {
    id: 3,
    date: '14/05/2023',
    time: '14:45 PM',
    location: 'Mina Este - Galería 3',
    gasType: 'Dióxido de Carbono (CO₂)',
    level: '0.8%',
    status: 'Normal',
    recordedBy: 'C. Vargas'
  }, {
    id: 4,
    date: '14/05/2023',
    time: '16:20 PM',
    location: 'Mina Norte - Sección D',
    gasType: 'Metano (CH₄)',
    level: '4.2%',
    status: 'Peligro',
    recordedBy: 'R. Mendoza'
  }, {
    id: 5,
    date: '13/05/2023',
    time: '11:10 AM',
    location: 'Mina Oeste - Galería 1',
    gasType: 'Sulfuro de Hidrógeno (H₂S)',
    level: '8 ppm',
    status: 'Normal',
    recordedBy: 'L. Torres'
  }];
  return <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Registro de Gases</h1>
        <button className="flex items-center px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-900" onClick={() => setShowGasForm(true)}>
          <PlusIcon size={18} className="mr-2" />
          Nuevo Registro
        </button>
      </div>
      {showGasForm ? <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Nuevo Registro de Gas</h2>
            <button className="text-gray-500 hover:text-gray-700" onClick={() => setShowGasForm(false)}>
              ✕
            </button>
          </div>
          <GasRegistryForm onCancel={() => setShowGasForm(false)} />
        </div> : <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <h2 className="text-lg font-semibold mr-3">
                Registros Recientes
              </h2>
              <div className="flex items-center text-amber-600 bg-amber-50 px-3 py-1 rounded-md">
                <AlertTriangleIcon size={16} className="mr-1" />
                <span className="text-sm">1 Advertencia</span>
              </div>
              <div className="ml-3 flex items-center text-red-600 bg-red-50 px-3 py-1 rounded-md">
                <AlertTriangleIcon size={16} className="mr-1" />
                <span className="text-sm">1 Nivel Peligroso</span>
              </div>
            </div>
            <button className="flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-sm text-gray-600 hover:bg-gray-50">
              <FilterIcon size={16} className="mr-2" />
              Filtrar
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr className="bg-gray-200 text-gray-700">
                  <th className="py-3 px-4 text-left">Fecha</th>
                  <th className="py-3 px-4 text-left">Hora</th>
                  <th className="py-3 px-4 text-left">Ubicación</th>
                  <th className="py-3 px-4 text-left">Tipo de Gas</th>
                  <th className="py-3 px-4 text-left">Nivel</th>
                  <th className="py-3 px-4 text-left">Estado</th>
                  <th className="py-3 px-4 text-left">Registrado por</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {gasRecords.map(record => <tr key={record.id} className="hover:bg-gray-50">
                    <td className="py-3 px-4">{record.date}</td>
                    <td className="py-3 px-4">{record.time}</td>
                    <td className="py-3 px-4">{record.location}</td>
                    <td className="py-3 px-4">{record.gasType}</td>
                    <td className="py-3 px-4 font-medium">{record.level}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${record.status === 'Normal' ? 'bg-green-100 text-green-800' : record.status === 'Advertencia' ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'}`}>
                        {record.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">{record.recordedBy}</td>
                  </tr>)}
              </tbody>
            </table>
          </div>
        </div>}
    </div>;
};