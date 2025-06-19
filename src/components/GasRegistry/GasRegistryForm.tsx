import React from 'react'
interface GasRegistryFormProps {
  onCancel: () => void
}
export const GasRegistryForm: React.FC<GasRegistryFormProps> = ({
  onCancel,
}) => {
  return (
    <form className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Fecha
          </label>
          <input
            type="date"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-800"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Hora
          </label>
          <input
            type="time"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-800"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Ubicación
          </label>
          <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-800">
            <option value="">Seleccionar ubicación</option>
            <option value="mina-norte-a">Mina Norte - Sección A</option>
            <option value="mina-norte-b">Mina Norte - Sección B</option>
            <option value="mina-sur-a">Mina Sur - Sección A</option>
            <option value="mina-este-1">Mina Este - Galería 1</option>
            <option value="mina-oeste-2">Mina Oeste - Galería 2</option>
          </select>
        </div>
        
       
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Registrado por
          </label>
          <input
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-800"
            placeholder="Nombre del supervisor"
          />
        </div>
      </div>
      
      <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
            Concentraciones de Gases
            </label>
            <table className="w-full border border-gray-300 text-sm text-gray-700">
            <thead>
              <tr className="bg-gray-100 border px-2 py-1">
              <th className="border px-2 py-1">Metano (CH₄)</th>
              <th className="border px-2 py-1">Monóxido de Carbono (CO)</th>
              <th className="border px-2 py-1">Dióxido de Carbono (CO₂)</th>
              <th className="border px-2 py-1">Sulfuro de Hidrógeno (H₂S)</th>
              <th className="border px-2 py-1">Oxígeno (O₂)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                 <td className="border px-2 py-1">
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-1 sm:space-y-0 sm:space-x-2">
                    <input
                      type="text"
                      className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-800"
                      placeholder="0.0"
                      defaultValue="0.0"
                      onChange={(e) => {
                        const value = e.target.value.replace(/[^\d.]/g, '');
                        e.target.value = value;
                      }}
                    />
                    <select
                      className="px-1 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-800"
                      defaultValue="%"
                    >
                      <option value="%">%</option>
                      <option value="ppm">ppm</option>
                    </select>
                  </div>
                </td>

                <td className="border px-2 py-1">
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-1 sm:space-y-0 sm:space-x-2">
                    <input
                      type="text"
                      className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-800"
                      placeholder="0.0"
                      defaultValue="0.0"
                      onChange={(e) => {
                        const value = e.target.value.replace(/[^\d.]/g, '');
                        e.target.value = value;
                      }}
                    />
                    <select
                      className="px-1 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-800"
                      defaultValue="%"
                    >
                      <option value="%">%</option>
                      <option value="ppm">ppm</option>
                    </select>
                  </div>
                </td>


                 <td className="border px-2 py-1">
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-1 sm:space-y-0 sm:space-x-2">
                    <input
                      type="text"
                      className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-800"
                      placeholder="0.0"
                      defaultValue="0.0"
                      onChange={(e) => {
                        const value = e.target.value.replace(/[^\d.]/g, '');
                        e.target.value = value;
                      }}
                    />
                    <select
                      className="px-1 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-800"
                      defaultValue="%"
                    >
                      <option value="%">%</option>
                      <option value="ppm">ppm</option>
                    </select>
                  </div>
                </td>


                <td className="border px-2 py-1">
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-1 sm:space-y-0 sm:space-x-2">
                    <input
                      type="text"
                      className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-800"
                      placeholder="0.0"
                      defaultValue="0.0"
                      onChange={(e) => {
                        const value = e.target.value.replace(/[^\d.]/g, '');
                        e.target.value = value;
                      }}
                    />
                    <select
                      className="px-1 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-800"
                      defaultValue="%"
                    >
                      <option value="%">%</option>
                      <option value="ppm">ppm</option>
                    </select>
                  </div>
                </td>

                <td className="border px-2 py-1">
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-1 sm:space-y-0 sm:space-x-2">
                    <input
                      type="text"
                      className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-800"
                      placeholder="0.0"
                      defaultValue="0.0"
                      onChange={(e) => {
                        const value = e.target.value.replace(/[^\d.]/g, '');
                        e.target.value = value;
                      }}
                    />
                    <select
                      className="px-1 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-800"
                      defaultValue="%"
                    >
                      <option value="%">%</option>
                      <option value="ppm">ppm</option>
                    </select>
                  </div>
                </td>

              </tr>
            </tbody>
            </table>
        </div>

        <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Observaciones
        </label>
        <textarea
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-800"
          placeholder="Observaciones adicionales..."
        ></textarea>
      </div>

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
          className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-900"
        >
          Guardar Registro
        </button>
      </div>
    </form>
  )
}
