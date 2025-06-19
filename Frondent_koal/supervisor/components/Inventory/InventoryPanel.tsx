import React, { useState } from 'react';
import { PlusIcon, FilterIcon, DownloadIcon, AlertTriangleIcon } from 'lucide-react';
import { ProductionDataForm } from './ProductionDataForm';

interface InventoryItem {
  id: number;
  name: string;
  quantity: string;
  unit: string;
  location: string;
  lastUpdated: string;
  status: string; // Nuevo campo para el estado
}

export const InventoryPanel: React.FC = () => {
  const [showProductionForm, setShowProductionForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  // Mock inventory data con el nuevo campo 'status'
  const inventoryItems: InventoryItem[] = [
    {
      id: 1,
      name: 'Carbón Tipo A',
      quantity: '1,250',
      unit: 'Toneladas',
      location: 'Almacén Principal',
      lastUpdated: '14/05/2023',
      status: 'Bueno',
    },
    {
      id: 2,
      name: 'Carbón Tipo B',
      quantity: '850',
      unit: 'Toneladas',
      location: 'Almacén Sur',
      lastUpdated: '15/05/2023',
      status: 'Regular',
    },
    {
      id: 3,
      name: 'Herramientas',
      quantity: '45',
      unit: 'Unidades',
      location: 'Bodega Este',
      lastUpdated: '10/05/2023',
      status: 'Bueno',
    },
    {
      id: 4,
      name: 'Equipo de Seguridad',
      quantity: '120',
      unit: 'Sets',
      location: 'Bodega Central',
      lastUpdated: '12/05/2023',
      status: 'Malo',
    },
    {
      id: 5,
      name: 'Explosivos',
      quantity: '30',
      unit: 'Cajas',
      location: 'Almacén Seguridad',
      lastUpdated: '13/05/2023',
      status: 'Bueno',
    },
  ];

  // Contar ítems en estado "Regular" (Advertencia) y "Malo" (Peligro)
  const warningCount = inventoryItems.filter((item) => item.status === 'Regular').length;
  const dangerCount = inventoryItems.filter((item) => item.status === 'Malo').length;

  // Filtrar ítems
  const filteredItems = inventoryItems.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.unit.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus ? item.status === filterStatus : true;
    return matchesSearch && matchesStatus;
  });

  // Exportar a CSV
  const exportToCSV = () => {
    const headers = ['Material', 'Cantidad', 'Unidad', 'Ubicación', 'Última Actualización', 'Estado'];
    const rows = filteredItems.map((item) => [
      `"${item.name}"`,
      `"${item.quantity}"`,
      `"${item.unit}"`,
      `"${item.location}"`,
      `"${item.lastUpdated}"`,
      `"${item.status}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'inventario_actual.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Gestión de Producción</h1>
        <div className="flex gap-3">
          <button
            className="flex items-center px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-900"
            onClick={() => setShowProductionForm(true)}
          >
            <PlusIcon size={18} className="mr-2" />
            Agregar Datos de Producción
          </button>
        </div>
      </div>

      {showProductionForm ? (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Nuevo Registro de Producción</h2>
            <button
              className="text-gray-500 hover:text-gray-700"
              onClick={() => setShowProductionForm(false)}
            >
              ✕
            </button>
          </div>
          <ProductionDataForm onCancel={() => setShowProductionForm(false)} />
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <h2 className="text-lg font-semibold mr-3">Inventario Actual</h2>
              {warningCount > 0 && (
                <div className="flex items-center text-amber-600 bg-amber-50 px-3 py-1 rounded-md">
                  <AlertTriangleIcon size={16} className="mr-1" />
                  <span className="text-sm">{warningCount} Estado Regular</span>
                </div>
              )}
              {dangerCount > 0 && (
                <div className="ml-3 flex items-center text-red-600 bg-red-50 px-3 py-1 rounded-md">
                  <AlertTriangleIcon size={16} className="mr-1" />
                  <span className="text-sm">{dangerCount} Estado Malo</span>
                </div>
              )}
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3 space-y-2 sm:space-y-0 w-full">
              <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 space-y-2 sm:space-y-0 w-full">
                <input
                  type="text"
                  placeholder="Buscar por material, ubicación o unidad..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="px-3 py-1.5 border border-gray-300 rounded-md text-sm text-gray-600 focus:border-blue-500 focus:ring-blue-500 w-full"
                />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-1.5 border border-gray-300 rounded-md text-sm text-gray-600 focus:border-blue-500 focus:ring-blue-500 w-full"
                >
                  <option value="">Todos los estados</option>
                  <option value="Bueno">Bueno</option>
                  <option value="Regular">Regular</option>
                  <option value="Malo">Malo</option>
                </select>
              </div>
              <button
              className="flex items-center justify-center px-3 py-1.5 border border-gray-300 rounded-md text-sm text-gray-600 hover:bg-gray-50 w-full sm:w-auto"
              onClick={exportToCSV}
              >
              <DownloadIcon size={16} className="mr-2" />
              Exportar
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr className="bg-gray-200 text-gray-700">
                  <th className="py-3 px-4 text-left">Material</th>
                  <th className="py-3 px-4 text-left">Cantidad</th>
                  <th className="py-3 px-4 text-left">Unidad</th>
                  <th className="py-3 px-4 text-left">Ubicación</th>
                  <th className="py-3 px-4 text-left">Última Actualización</th>
                  <th className="py-3 px-4 text-left">Estado</th>
                  <th className="py-3 px-4 text-left">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium">{item.name}</td>
                    <td className="py-3 px-4">{item.quantity}</td>
                    <td className="py-3 px-4">{item.unit}</td>
                    <td className="py-3 px-4">{item.location}</td>
                    <td className="py-3 px-4">{item.lastUpdated}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          item.status === 'Bueno'
                            ? 'bg-green-100 text-green-800'
                            : item.status === 'Regular'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <button className="text-blue-600 hover:text-blue-800 mr-3">Editar</button>
                      <button className="text-red-600 hover:text-red-800">Eliminar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};