import React from 'react';
interface ProductionDataFormProps {
  onCancel: () => void;
}
export const ProductionDataForm: React.FC<ProductionDataFormProps> = ({
  onCancel
}) => {
  return <form className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Fecha de Producción
          </label>
          <input type="date" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-800" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Frente de Trabajo
          </label>
          <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-800">
            <option value="">Seleccionar frente de trabajo</option>
            <option value="frente-norte">Frente Norte</option>
            <option value="frente-sur">Frente Sur</option>
            <option value="frente-este">Frente Este</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tipo de Material
          </label>
          <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-800">
            <option value="">Seleccionar tipo</option>
            <option value="carbon-a">Carbón Tipo A</option>
            <option value="carbon-b">Carbón Tipo B</option>
            <option value="carbon-c">Carbón Tipo C</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Cantidad
          </label>
          <div className="flex">
            <input type="number" className="w-full px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-1 focus:ring-gray-800" placeholder="0" />
            <span className="inline-flex items-center px-3 py-2 border border-l-0 border-gray-300 bg-gray-100 rounded-r-md text-gray-600">
              Cochados
            </span>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Calidad
          </label>
          <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-800">
            <option value="">Seleccionar calidad</option>
            <option value="alta">Alta</option>
            <option value="media">Media</option>
            <option value="baja">Baja</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Supervisor
          </label>
          <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-800" placeholder="Nombre del supervisor" />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Observaciones
        </label>
        <textarea rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-800" placeholder="Observaciones adicionales..."></textarea>
      </div>
      <div className="flex justify-end space-x-3 pt-4">
        <button type="button" onClick={onCancel} className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
          Cancelar
        </button>
        <button type="submit" className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-900">
          Guardar Datos
        </button>
      </div>
    </form>;
};