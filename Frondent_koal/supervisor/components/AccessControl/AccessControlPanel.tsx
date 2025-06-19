import React, { useState, useEffect} from 'react';
// Importa React y el hook useState para manejar el estado del componente.

import { Empleado, getAllPersonnel } from '../../../src/servicios/personnelService';

import { UserPlusIcon, UserMinusIcon, SearchIcon, RefreshCwIcon, DownloadIcon } from 'lucide-react';
// Importa varios íconos desde la librería lucide-react.

import { AccessLogTable } from './AccessLogTable';
// Importa el componente de tabla de registros de acceso.

import { RegisterEntryForm, EntryFormData } from './RegisterEntryForm';
// Importa el formulario de registro de entrada y su tipo de datos.

import { RegisterExitForm, ExitFormData } from './RegisterExitForm';
// Importa el formulario de registro de salida y su tipo de datos.

import { EntryTable } from './EntryTable';
//Importa la tabla mostrando las entradas registradas

import { ExitTable } from './ExitTable';

/**
 * Componente principal para el panel de control de acceso.
 *
 * Este componente permite a los usuarios registrar entradas y salidas de empleados,
 * visualizar registros de acceso y filtrar los registros por tipo (todos, entradas, salidas).
 * Incluye funcionalidades para buscar empleados, refrescar la tabla y exportar los datos.
 *
 * @component
 *
 * @example
 * <AccessControlPanel />
 *
 * @returns {JSX.Element} El panel de control de acceso con formularios de registro y tabla de registros.
 */
export const AccessControlPanel: React.FC = () => {
// Declara el componente funcional AccessControlPanel.
 

  const [searchTerm, setSearchTerm] = useState('');
  const [resultados, setResultados] = useState<Empleado[]>([]);
 
  const buscarEmpleado = async () => {
    try {
      const data = await getAllPersonnel(searchTerm);
      setResultados(data as Empleado[]);
    } catch (error) {
      alert('No se encontró');
    }
  };
  // Buscar automaticamente los registros 
  useEffect(() =>{
    const timeout = setTimeout(() => {
      if (searchTerm) buscarEmpleado();
    }, 500); // Espera 500 ms despúes de escribir 

    return () => clearTimeout(timeout);
  }, [searchTerm]);

  const [activeTab, setActiveTab] = useState('all');
  // Estado para la pestaña activa (todos, entradas, salidas).

  const [showEntryForm, setShowEntryForm] = useState(false);
  // Estado para mostrar/ocultar el formulario de entrada.

  const [showExitForm, setShowExitForm] = useState(false);
  // Estado para mostrar/ocultar el formulario de salida.

  const handleRegisterEntry = (data: EntryFormData) => {
    console.log('Datos de entrada registrados:', data);
    // Función para manejar el registro de entrada. Por ahora solo imprime los datos.
    // Aquí iría la lógica para registrar la entrada
  };

  const handleRegisterExit = (data: ExitFormData) => {
    console.log('Datos de salida registrados:', data);
    // Función para manejar el registro de salida. Por ahora solo imprime los datos.
    // Aquí iría la lógica para registrar la salida
  };

  
  return (
    <div className="space-y-6">
    {/* Contenedor principal con espacio vertical entre elementos */}

      {showEntryForm && (
        <RegisterEntryForm 
          onClose={() => setShowEntryForm(false)} 
          onSubmit={handleRegisterEntry}
        />
      )}
      {/* Si showEntryForm es true, muestra el formulario de registro de entrada */}

      {showExitForm && (
        <RegisterExitForm 
          onClose={() => setShowExitForm(false)} 
          onSubmit={handleRegisterExit}
        />
      )}
      {/* Si showExitForm es true, muestra el formulario de registro de salida */}

      <div className="flex items-center justify-between">
      {/* Contenedor para el título y los botones de registrar entrada/salida */}

        <h1 className="text-2xl font-bold text-gray-800">Control de Acceso</h1>
        {/* Título principal del panel */}

        <div className="flex gap-3">
        {/* Contenedor de los botones de registrar entrada y salida */}

          <button 
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            onClick={() => setShowEntryForm(true)}
          >
            <UserPlusIcon size={18} className="mr-2" />
            Registrar Entrada
          </button>
          {/* Botón para abrir el formulario de registro de entrada */}

          <button 
            className="flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            onClick={() => setShowExitForm(true)}
          >
            <UserMinusIcon size={18} className="mr-2" />
            Registrar Salida
          </button>
          {/* Botón para abrir el formulario de registro de salida */}

        </div>
      </div>
      
      {/* Resto del código permanece igual */}
      <div className="bg-white rounded-lg shadow-md p-6">
      {/* Contenedor de la tarjeta principal con fondo blanco y sombra */}

        <div className="flex items-center justify-between mb-6">
        {/* Barra superior de la tarjeta con pestañas y controles */}

          <div className="flex space-x-4">
          {/* Contenedor de las pestañas de filtro */}

            <button className={`px-3 py-2 ${activeTab === 'all' ? 'border-b-2 border-gray-800 font-medium' : 'text-gray-600'}`} onClick={() => setActiveTab('all')}>
              Todos
            </button>
            {/* Botón para mostrar todos los registros */}

            <button className={`px-3 py-2 ${activeTab === 'entries' ? 'border-b-2 border-gray-800 font-medium' : 'text-gray-600'}`} onClick={() => setActiveTab('entries')}>
              Entradas
            </button>
            {/* Botón para mostrar solo las entradas */}

            <button className={`px-3 py-2 ${activeTab === 'exits' ? 'border-b-2 border-gray-800 font-medium' : 'text-gray-600'}`} onClick={() => setActiveTab('exits')}>
              Salidas
            </button>
            {/* Botón para mostrar solo las salidas */}

          </div>

          <div className="flex items-center space-x-3">
          {/* Contenedor de los controles de búsqueda, refrescar y exportar */}

            <div className="relative w-40 sm:w-60">
            {/* Contenedor relativo para el input de búsqueda */}

              <input
                type="text"
                placeholder="Buscar empleado..."
                className="pl-9 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-800 w-full text-sm"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
              {/* Campo de texto para buscar empleados */}

              

              <SearchIcon size={18} className="absolute left-3 top-2.5 text-gray-400" />
              {/* Icono de búsqueda posicionado dentro del input */}

            </div>

            <button className="p-2 text-gray-600 hover:text-gray-900">
              <RefreshCwIcon size={18} />
            </button>
            {/* Botón para refrescar la tabla de registros */}

            <button className="p-2 text-gray-600 hover:text-gray-900">
              <DownloadIcon size={18} />
            </button>
            {/* Botón para exportar los datos */}

          </div>
        </div>

        {/* ... */}
       
        {/* Componente que muestra la tabla de registros de acceso */}
         {/* Mostrar la tabla correspondiente según la pestaña activa */}
        {activeTab === 'all' && (
          <AccessLogTable logs={searchTerm ? resultados : undefined} />)}
          
        
        {activeTab === 'entries' && (
          <EntryTable logs={searchTerm ? resultados: undefined} />
        )}

        {activeTab === 'exits' && (
          <ExitTable logs={searchTerm ? resultados: undefined} />
        )}

      </div>
    </div>
  );
};
// Fin del componente AccessControlPanel

