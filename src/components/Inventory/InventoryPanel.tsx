import React, { useState, useEffect } from 'react';
import { PlusIcon, DownloadIcon, AlertTriangleIcon, RefreshCwIcon } from 'lucide-react';
import { ProductionDataForm } from './ProductionDataForm';
import * as XLSX from 'xlsx'; // Importa la librería xlsx

interface ProductionRecord {
  id?: number;
  production_date: string;
  work_front: string;
  material_type: string;
  quantity_produced: number;
  unit: string;
  quality: string;
  supervisor: string;
  observations?: string;
  created_at?: string;
}

export const InventoryPanel: React.FC = () => {
  // Función para formatear texto a formato título (primera letra mayúscula)
  const formatText = (text: string) => {
    if (!text) return text;
    
    return text
      .split(/[- ]/) // Dividir por guiones o espacios
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(text.includes('-') ? '-' : ' '); // Unir manteniendo el separador original
  };

  const [showProductionForm, setShowProductionForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [productionRecords, setProductionRecords] = useState<ProductionRecord[]>([]);
  const [editingProductionRecord, setEditingProductionRecord] = useState<ProductionRecord | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [refreshCounter, setRefreshCounter] = useState(0);

  const API_BASE_URL = 'http://localhost:8000/api/';

  // Contar registros por calidad
  const highQualityCount = productionRecords.filter(record => record.quality === 'Alta').length;
  const mediumQualityCount = productionRecords.filter(record => record.quality === 'Media').length;
  const lowQualityCount = productionRecords.filter(record => record.quality === 'Baja').length;

  // Filtrar registros
  const filteredRecords = productionRecords.filter(record => {
    const matchesSearch = 
      record.work_front.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.material_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.supervisor.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const fetchProductionRecords = async () => {
    try {
      setIsLoading(true); // Establecer isLoading a true al inicio de la carga
      const response = await fetch(`${API_BASE_URL}production-records/`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: ProductionRecord[] = await response.json();
      setProductionRecords(data);
      setLastUpdated(new Date().toLocaleTimeString());
      setRefreshCounter(prev => prev + 1);
    } catch (error) {
      console.error("Error al obtener los registros de producción:", error);
    } finally {
      setIsLoading(false); // Restablecer isLoading a false al final, independientemente del éxito o error
    }
  };

  // Configurar el refresco automático cada 30 segundos
  useEffect(() => {
    // Cargar inmediatamente
    fetchProductionRecords();

    // Configurar intervalo de 30 segundos (30000 ms)
    const interval = setInterval(fetchProductionRecords, 30000);

    // Limpiar intervalo al desmontar
    return () => clearInterval(interval);
  }, []);

  const handleAddProductionData = () => {
    setEditingProductionRecord(null);
    setShowProductionForm(true);
  };

  const handleEditProductionRecord = (record: ProductionRecord) => {
    setEditingProductionRecord(record);
    setShowProductionForm(true);
  };

  const handleDeleteProductionRecord = async (id: number) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar este registro de producción?")) {
      try {
        setIsLoading(true);
        const response = await fetch(`${API_BASE_URL}production-records/${id}/`, {
          method: 'DELETE',
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        fetchProductionRecords();
      } catch (error) {
        console.error("Error al eliminar el registro de producción:", error);
        alert("Hubo un error al eliminar el registro de producción.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleFormCancel = () => {
    setShowProductionForm(false);
    setEditingProductionRecord(null);
  };

  const handleProductionFormSubmit = async (formData: ProductionRecord) => {
    try {
      setIsLoading(true);
      let response;
      if (formData.id) {
        response = await fetch(`${API_BASE_URL}production-records/${formData.id}/`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
      } else {
        response = await fetch(`${API_BASE_URL}production-records/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
      }

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error detallado al guardar/editar:", errorData);
        alert(`Error al guardar: ${JSON.stringify(errorData)}`);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setShowProductionForm(false);
      setEditingProductionRecord(null);
      fetchProductionRecords();
    } catch (error) {
      console.error("Error en la operación de guardar/editar:", error);
      if (error instanceof Error) {
        alert(`Hubo un problema al conectar con el servidor o procesar la solicitud: ${error.message}`);
      } else {
        alert("Hubo un problema al conectar con el servidor o procesar la solicitud.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Exportar a CSV (Función eliminada porque no se utiliza)

  // ********************************************
  // NUEVA FUNCIÓN: EXPORTAR A XLSX con plantilla profesional
  // ********************************************
  const exportToXLSX = () => {
    const companyName = "KOAL GROUP"; // Nombre de la empresa
    const reportTitle = "REPORTE DE REGISTROS DE PRODUCCIÓN";
    // Formatear la fecha para Sogamoso, Boyacá, Colombia
    const generatedDate = `Fecha de Generación: ${new Date().toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' })}`;
    const location = "Sogamoso, Boyacá, Colombia";
    const contact = "Contacto: Soporte Técnico Koal Group";

    // Encabezados de la tabla para el archivo XLSX
    const tableHeaders = [
      'ID Registro', // Puedes incluir el ID si es relevante para el reporte
      'Fecha Producción',
      'Frente de Trabajo',
      'Tipo de Material',
      'Cantidad Producida',
      'Unidad',
      'Calidad',
      'Supervisor',
      'Observaciones'
    ];

    // Mapear los datos de los registros al formato de array de arrays para SheetJS
    const dataForTable = filteredRecords.map(record => [
      record.id,
      record.production_date,
      formatText(record.work_front),
      formatText(record.material_type),
      record.quantity_produced,
      record.unit,
      record.quality,
      record.supervisor,
      record.observations || '', // Asegurar que las observaciones no sean undefined
    ]);

    // Crear la estructura final de datos para la hoja, incluyendo encabezados de la empresa
    const finalData = [
      [companyName], // Fila 1: Nombre de la empresa
      [reportTitle],   // Fila 2: Título del reporte
      [],              // Fila 3: Vacía para espacio
      [generatedDate], // Fila 4: Fecha de generación
      [location],      // Fila 5: Ubicación
      [contact],       // Fila 6: Contacto
      [],              // Fila 7: Vacía
      [],              // Fila 8: Vacía
      tableHeaders,    // Fila 9: Encabezados de la tabla real
      ...dataForTable  // Datos de la tabla
    ];

    // Crear una nueva hoja de trabajo a partir del array final de datos
    const worksheet = XLSX.utils.aoa_to_sheet(finalData);

    // Calcular el número de columnas de la tabla para la fusión
    const numCols = tableHeaders.length;

    // Fusionar celdas para los títulos y metadatos
    if (!worksheet['!merges']) worksheet['!merges'] = [];
    worksheet['!merges'].push({ s: { r: 0, c: 0 }, e: { r: 0, c: numCols - 1 } }); // Nombre de la empresa
    worksheet['!merges'].push({ s: { r: 1, c: 0 }, e: { r: 1, c: numCols - 1 } }); // Título del reporte
    worksheet['!merges'].push({ s: { r: 3, c: 0 }, e: { r: 3, c: numCols - 1 } }); // Fecha de generación
    worksheet['!merges'].push({ s: { r: 4, c: 0 }, e: { r: 4, c: numCols - 1 } }); // Ubicación
    worksheet['!merges'].push({ s: { r: 5, c: 0 }, e: { r: 5, c: numCols - 1 } }); // Contacto

    // Opcional: Ajustar el ancho de las columnas
    const columnWidths = [
      { wch: 8 },  // ID Registro
      { wch: 15 }, // Fecha Producción
      { wch: 25 }, // Frente de Trabajo
      { wch: 20 }, // Tipo de Material
      { wch: 12 }, // Cantidad Producida
      { wch: 10 }, // Unidad
      { wch: 10 }, // Calidad
      { wch: 20 }, // Supervisor
      { wch: 40 }, // Observaciones
    ];
    worksheet['!cols'] = columnWidths;

    // Crear un nuevo libro de trabajo y añadir la hoja
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Registros de Producción');

    // Escribir y descargar el archivo XLSX
    XLSX.writeFile(workbook, 'registros_produccion.xlsx');
  };


  return (
    <div className="space-y-6 relative">
      {/* Indicador sutil de actualización (solo visible durante carga) */}
      <div className={`fixed bottom-4 right-4 flex items-center space-x-2 bg-gray-800 text-white px-3 py-1 rounded-md text-sm transition-opacity duration-300 ${isLoading ? 'opacity-70' : 'opacity-0 pointer-events-none'}`}>
        <RefreshCwIcon size={14} className={`animate-spin`} />
        <span>Actualizando... {lastUpdated}</span>
      </div>

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Gestión de Producción</h1>
        <div className="flex gap-3">
          <button
            className="flex items-center px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-900 disabled:opacity-50"
            onClick={handleAddProductionData}
            disabled={isLoading}
          >
            <PlusIcon size={18} className="mr-2" />
            Agregar Datos de Producción
          </button>
        </div>
      </div>

      {showProductionForm ? (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">
              {editingProductionRecord ? 'Editar Registro' : 'Nuevo Registro de Producción'}
            </h2>
            <button
              className="text-gray-500 hover:text-gray-700"
              onClick={handleFormCancel}
              disabled={isLoading}
            >
              ✕
            </button>
          </div>
          <ProductionDataForm 
            onCancel={handleFormCancel}
            onSubmit={handleProductionFormSubmit}
            initialData={
              editingProductionRecord
                ? { ...editingProductionRecord, observations: editingProductionRecord.observations ?? '' }
                : undefined
            }
          />
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <h2 className="text-lg font-semibold mr-3">Registros de Producción</h2>
              {highQualityCount > 0 && (
                <div className="flex items-center text-green-600 bg-green-50 px-3 py-1 rounded-md mr-2">
                  <AlertTriangleIcon size={16} className="mr-1" />
                  <span className="text-sm">{highQualityCount} Alta calidad</span>
                </div>
              )}
              {mediumQualityCount > 0 && (
                <div className="flex items-center text-amber-600 bg-amber-50 px-3 py-1 rounded-md mr-2">
                  <AlertTriangleIcon size={16} className="mr-1" />
                  <span className="text-sm">{mediumQualityCount} Media calidad</span>
                </div>
              )}
              {lowQualityCount > 0 && (
                <div className="flex items-center text-red-600 bg-red-50 px-3 py-1 rounded-md">
                  <AlertTriangleIcon size={16} className="mr-1" />
                  <span className="text-sm">{lowQualityCount} Baja calidad</span>
                </div>
              )}
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3 space-y-2 sm:space-y-0 w-full sm:w-auto">
              <input
                type="text"
                placeholder="Buscar por frente, material o supervisor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-3 py-1.5 border border-gray-300 rounded-md text-sm text-gray-600 focus:border-blue-500 focus:ring-blue-500 w-full"
              />
              <button
                className="flex items-center justify-center px-3 py-1.5 border border-gray-300 rounded-md text-sm text-gray-600 hover:bg-gray-50 w-full sm:w-auto disabled:opacity-50"
                onClick={exportToXLSX} // CAMBIADO a exportToXLSX
                disabled={isLoading}
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
                  <th className="py-3 px-4 text-left">Fecha</th>
                  <th className="py-3 px-4 text-left">Frente de Trabajo</th>
                  <th className="py-3 px-4 text-left">Material</th>
                  <th className="py-3 px-4 text-left">Cantidad</th>
                  <th className="py-3 px-4 text-left">Unidad</th>
                  <th className="py-3 px-4 text-left">Calidad</th>
                  <th className="py-3 px-4 text-left">Supervisor</th>
                  <th className="py-3 px-4 text-left">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredRecords.length > 0 ? (
                  filteredRecords.map((record) => (
                    <tr key={`${record.id}-${refreshCounter}`} className="hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium">{record.production_date}</td>
                      <td className="py-3 px-4">{formatText(record.work_front)}</td>
                      <td className="py-3 px-4">{formatText(record.material_type)}</td>
                      <td className="py-3 px-4">{record.quantity_produced}</td>
                      <td className="py-3 px-4">{record.unit}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            record.quality === 'Alta'
                              ? 'bg-green-100 text-green-800'
                              : record.quality === 'Media'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {record.quality}
                        </span>
                      </td>
                      <td className="py-3 px-4">{record.supervisor}</td>
                      <td className="py-3 px-4">
                        <button 
                          className="text-blue-600 hover:text-blue-800 mr-3 disabled:opacity-50"
                          onClick={() => handleEditProductionRecord(record)}
                          disabled={isLoading}
                        >
                          Editar
                        </button>
                        <button 
                          className="text-red-600 hover:text-red-800 disabled:opacity-50"
                          onClick={() => record.id && handleDeleteProductionRecord(record.id)}
                          disabled={isLoading}
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="py-3 px-4 text-center text-gray-500">
                      No hay registros de producción que coincidan con la búsqueda.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};