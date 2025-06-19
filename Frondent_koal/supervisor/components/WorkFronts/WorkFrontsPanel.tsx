import React, { useState } from 'react';
import { PlusIcon, UserIcon, MapPinIcon, ClockIcon, CalendarIcon } from 'lucide-react';
import { WorkFrontForm } from './WorkFrontForm';
export const WorkFrontsPanel: React.FC = () => {
  const [showWorkFrontForm, setShowWorkFrontForm] = useState(false);
  // Mock work fronts data
  const workFronts = [{
    id: 1,
    name: 'Frente Norte - Excavación Principal',
    status: 'Activo',
    location: 'Sector Norte, Nivel -150m',
    workers: 12,
    startDate: '10/04/2023',
    estimatedEnd: '25/06/2023',
    progress: 65
  }, {
    id: 2,
    name: 'Frente Sur - Ampliación',
    status: 'Activo',
    location: 'Sector Sur, Nivel -120m',
    supervisor: 'Ana Rivera',
    workers: 8,
    startDate: '15/03/2023',
    estimatedEnd: '30/05/2023',
    progress: 85
  }, {
    id: 3,
    name: 'Frente Este - Preparación',
    status: 'Planificado',
    location: 'Sector Este, Nivel -100m',
    supervisor: 'Roberto Pérez',
    workers: 6,
    startDate: '01/06/2023',
    estimatedEnd: '15/08/2023',
    progress: 0
  }, ];
  return <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Frentes de Trabajo</h1>
        <button className="flex items-center px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-900" onClick={() => setShowWorkFrontForm(true)}>
          <PlusIcon size={18} className="mr-2" />
          Nuevo Frente
        </button>
      </div>
      {showWorkFrontForm ? <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">
              Crear Nuevo Frente de Trabajo
            </h2>
            <button className="text-gray-500 hover:text-gray-700" onClick={() => setShowWorkFrontForm(false)}>
              ✕
            </button>
          </div>
          <WorkFrontForm onCancel={() => setShowWorkFrontForm(false)} />
        </div> : <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {workFronts.map(front => <div key={front.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {front.name}
                  </h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${front.status === 'Activo' ? 'bg-green-100 text-green-800' : front.status === 'Planificado' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
                    {front.status}
                  </span>
                </div>
                <div className="mt-4 space-y-3">
                  <div className="flex items-center text-gray-600">
                    <MapPinIcon size={16} className="mr-2" />
                    <span>{front.location}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <UserIcon size={16} className="mr-2" />
                    <span>Supervisor: {front.supervisor}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <CalendarIcon size={16} className="mr-2" />
                    <span>
                      Inicio: {front.startDate} | Fin Est.: {front.estimatedEnd}
                    </span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <ClockIcon size={16} className="mr-2" />
                    <span>Trabajadores asignados: {front.workers}</span>
                  </div>
                </div>
                <div className="mt-5">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">
                      Progreso
                    </span>
                    <span className="text-sm font-medium text-gray-700">
                      {front.progress}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-gray-800 h-2.5 rounded-full" style={{
                width: `${front.progress}%`
              }}></div>
                  </div>
                </div>
              </div>
              <div className="border-t border-gray-200 bg-gray-50 px-6 py-3 flex justify-end">
                <button className="text-blue-600 hover:text-blue-800 text-sm font-medium mr-4">
                  Editar
                </button>
                <button className="text-gray-600 hover:text-gray-800 text-sm font-medium">
                  Ver Detalles
                </button>
              </div>
            </div>)}
        </div>}
    </div>;
};