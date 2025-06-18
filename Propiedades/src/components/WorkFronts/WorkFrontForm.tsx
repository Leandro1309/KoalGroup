import React from 'react';
interface WorkFrontFormProps {
  onCancel: () => void;
}
export const WorkFrontForm: React.FC<WorkFrontFormProps> = ({
  onCancel
}) => {
  return <form className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nombre del Frente
          </label>
          <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-800" placeholder="Ej: Frente Norte - Excavación Principal" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Ubicación
          </label>
          <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-800" placeholder="Ej: Sector Norte, Nivel -150m" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Estado
          </label>
          <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-800">
            <option value="activo">Activo</option>
            <option value="planificado">Planificado</option>
            <option value="pausa">En pausa</option>
            <option value="completado">Completado</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Fecha de Inicio
          </label>
          <input type="date" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-800" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Fecha Estimada de Finalización
          </label>
          <input type="date" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-800" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Número de Trabajadores
          </label>
          <input type="number" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-800" placeholder="0" min="1" />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Descripción del Trabajo
          </label>
          <textarea rows={4} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-800" placeholder="Descripción detallada del frente de trabajo..."></textarea>
        </div>
      </div>
      <div className="flex justify-end space-x-3 pt-4">
        <button type="button" onClick={onCancel} className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
          Cancelar
        </button>
        <button type="submit" className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-900">
          Crear Frente de Trabajo
        </button>
      </div>
    </form>;
};