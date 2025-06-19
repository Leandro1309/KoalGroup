// components/AccessControl/AccessControlPanel.tsx
import React, { useState } from 'react';
import { UserPlusIcon, UserMinusIcon, SearchIcon, RefreshCwIcon, DownloadIcon } from 'lucide-react';
import { AccessLogTable } from './AccessLogTable';
import { RegisterEntryForm, EntryFormData } from './RegisterEntryForm';
import { RegisterExitForm, ExitFormData } from './RegisterExitForm';

export const AccessControlPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [showEntryForm, setShowEntryForm] = useState(false);
  const [showExitForm, setShowExitForm] = useState(false);
  
  const handleRegisterEntry = (data: EntryFormData) => {
    console.log('Datos de entrada registrados:', data);
    // Aquí iría la lógica para registrar la entrada
  };

  const handleRegisterExit = (data: ExitFormData) => {
    console.log('Datos de salida registrados:', data);
    // Aquí iría la lógica para registrar la salida
  };

  return (
    <div className="space-y-6">
      {showEntryForm && (
        <RegisterEntryForm 
          onClose={() => setShowEntryForm(false)} 
          onSubmit={handleRegisterEntry}
        />
      )}
      
      {showExitForm && (
        <RegisterExitForm 
          onClose={() => setShowExitForm(false)} 
          onSubmit={handleRegisterExit}
        />
      )}
      
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Control de Acceso</h1>
        <div className="flex gap-3">
          <button 
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            onClick={() => setShowEntryForm(true)}
          >
            <UserPlusIcon size={18} className="mr-2" />
            Registrar Entrada
          </button>
          <button 
            className="flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            onClick={() => setShowExitForm(true)}
          >
            <UserMinusIcon size={18} className="mr-2" />
            Registrar Salida
          </button>
        </div>
      </div>
      
      {/* Resto del código permanece igual */}
      <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
          <div className="flex space-x-4">
            <button className={`px-3 py-2 ${activeTab === 'all' ? 'border-b-2 border-gray-800 font-medium' : 'text-gray-600'}`} onClick={() => setActiveTab('all')}>
              Todos
            </button>
            <button className={`px-3 py-2 ${activeTab === 'entries' ? 'border-b-2 border-gray-800 font-medium' : 'text-gray-600'}`} onClick={() => setActiveTab('entries')}>
              Entradas
            </button>
            <button className={`px-3 py-2 ${activeTab === 'exits' ? 'border-b-2 border-gray-800 font-medium' : 'text-gray-600'}`} onClick={() => setActiveTab('exits')}>
              Salidas
            </button>
          </div>
          <div className="flex items-center space-x-3">
            <div className="relative w-40 sm:w-60">
              <input
              type="text"
              placeholder="Buscar empleado..."
              className="pl-9 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-800 w-full text-sm"
              />
              <SearchIcon size={18} className="absolute left-3 top-2.5 text-gray-400" />
            </div>
            <button className="p-2 text-gray-600 hover:text-gray-900">
              <RefreshCwIcon size={18} />
            </button>
            <button className="p-2 text-gray-600 hover:text-gray-900">
              <DownloadIcon size={18} />
            </button>
          </div>
        </div>
        {/* ... */}
        <AccessLogTable />
      </div>
    </div>
  );
};