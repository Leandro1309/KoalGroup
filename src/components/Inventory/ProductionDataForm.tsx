import React, { useState, useEffect } from 'react';

interface ProductionFormData {
  id?: number;
  production_date: string;
  work_front: string;
  material_type: string;
  quantity_produced: number;
  unit: string;
  quality: string;
  supervisor: string;
  observations: string;
}

interface ProductionDataFormProps {
  onCancel: () => void;
  onSubmit: (formData: ProductionFormData) => void;
  initialData?: ProductionFormData | null;
}

export const ProductionDataForm: React.FC<ProductionDataFormProps> = ({
  onCancel,
  onSubmit,
  initialData,
}) => {
  const [formData, setFormData] = useState<ProductionFormData>({
    production_date: new Date().toISOString().split('T')[0],
    work_front: '',
    material_type: '',
    quantity_produced: 1, // Cambiado de 0 a 1 como valor inicial
    unit: 'Cochados',
    quality: 'Media',
    supervisor: '',
    observations: '',
  });
  const [error, setError] = useState<string | null>(null);

  // Initialize form with initialData when component mounts or initialData changes
  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        // Asegurarse que quantity_produced sea al menos 1
        quantity_produced: Math.max(1, initialData.quantity_produced || 1),
        production_date: initialData.production_date || new Date().toISOString().split('T')[0],
        unit: initialData.unit || 'Cochados',
        quality: initialData.quality || 'Media',
        observations: initialData.observations || '',
      });
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === 'quantity_produced') {
      const quantity = parseFloat(value);
      if (isNaN(quantity)) {
        setError('La cantidad debe ser un número válido');
      } else if (quantity < 1) {
        setError('La cantidad debe ser mayor o igual a 1');
      } else {
        setError(null);
      }
    }

    setFormData(prev => ({
      ...prev,
      [name]: name === 'quantity_produced' ? parseFloat(value) || 1 : value,
    }));
  };

  const handleMaterialChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const materialType = e.target.value;
    setFormData(prev => ({
      ...prev,
      material_type: materialType,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validación adicional antes de enviar
    if (formData.quantity_produced < 1) {
      setError('La cantidad debe ser mayor o igual a 1');
      return;
    }

    console.log("Submitting form data:", formData);
    onSubmit(formData);
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-2 rounded">
          <p>{error}</p>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Production Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Fecha de Producción
          </label>
          <input
            type="date"
            name="production_date"
            value={formData.production_date}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-800"
            required
          />
        </div>

        {/* Work Front */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Frente de Trabajo
          </label>
          <select
            name="work_front"
            value={formData.work_front}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-800"
            required
          >
            <option value="">Seleccionar frente de trabajo</option>
            <option value="frente-norte">Frente Norte</option>
            <option value="frente-sur">Frente Sur</option>
            <option value="frente-este">Frente Este</option>
          </select>
        </div>

        {/* Material Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tipo de Material
          </label>
          <select
            name="material_type"
            value={formData.material_type}
            onChange={handleMaterialChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-800"
            required
          >
            <option value="">Seleccionar tipo</option>
            <option value="carbon-a">Carbón Tipo A</option>
            <option value="carbon-b">Carbón Tipo B</option>
            <option value="carbon-c">Carbón Tipo C</option>
          </select>
        </div>

        {/* Quantity Produced */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Cantidad
          </label>
          <div className="flex">
            <input
              type="number"
              name="quantity_produced"
              value={formData.quantity_produced}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-1 focus:ring-gray-800"
              placeholder="1"
              required
              min="1"
              step="0.01"
            />
            <span className="inline-flex items-center px-3 py-2 border border-l-0 border-gray-300 bg-gray-100 rounded-r-md text-gray-600">
              {formData.unit}
            </span>
          </div>
        </div>

        {/* Quality */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Calidad
          </label>
          <select
            name="quality"
            value={formData.quality}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-800"
            required
          >
            <option value="Alta">Alta</option>
            <option value="Media">Media</option>
            <option value="Baja">Baja</option>
          </select>
        </div>

        {/* Supervisor */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Supervisor
          </label>
          <select
            name="supervisor"
            value={formData.supervisor}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-800"
            required
          >
            <option value="">Seleccionar supervisor</option>
            <option value="Harryson">Harryson</option>
            <option value="Supervisor">Supervisor</option>
          </select>
        </div>
      </div>

      {/* Observations */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Observaciones
        </label>
        <textarea
          rows={3}
          name="observations"
          value={formData.observations}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-800"
          placeholder="Observaciones adicionales..."
        />
      </div>

      {/* Buttons */}
      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-900 disabled:opacity-50"
          disabled={!!error || formData.quantity_produced < 1}
        >
          {initialData ? 'Actualizar Registro' : 'Guardar Datos'}
        </button>
      </div>
    </form>
  );
};