import React, { useState, useEffect } from 'react';
import { SearchIcon, PlusIcon, EditIcon, UserIcon } from 'lucide-react';
import { Employee } from '../../../src/api/types';
import { FingerprintScanner } from './FingerprintScanner';
import { personnelService } from '../../../services/api';


// Definimos la interfaz para el estado del formulario
interface FormData {
  name: string;
  role: string;
  idNumber: string;
  phone: string;
  email: string;
  project: string;
  fingerprint: string; // Este campo almacenará el 'token' o ID de la huella después de una lectura exitosa simulada
}

// Agregamos interfaz para errores
interface FormErrors {
  name?: string;
  role?: string;
  idNumber?: string;
  phone?: string;
  email?: string;
  project?: string;
  fingerprint?: string;
}

// Definimos un tipo para el estado del proceso de escaneo
type ScanStatus = 'idle' | 'scanning' | 'success' | 'error';


export const PersonnelList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [personnel, setPersonnel] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    role: '',
    idNumber: '',
    phone: '',
    email: '',
    project: '',
    fingerprint: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [scanStatus, setScanStatus] = useState<ScanStatus>('idle');
  const [scanError, setScanError] = useState<string | null>(null);

  // Cargar datos del personal
  useEffect(() => {
    const fetchPersonnel = async () => {
      try {
        setLoading(true);
        // Corrige el llamado al servicio
        const response = await personnelService.getAll();
        setPersonnel(response.data);
        setError(null);
      } catch (err) {
        setError('Error al cargar el personal');
        setPersonnel([]); // Asegura que la tabla esté vacía si hay error
      } finally {
        setLoading(false);
      }
    };

    fetchPersonnel();
  }, []);

  // Filtramos el personal
  const filteredPersonnel = personnel.filter(person =>
    person.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    person.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    person.project?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Función de validación
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    // Validar nombre
    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido';
    } else if (formData.name.length < 3) {
      newErrors.name = 'El nombre debe tener al menos 3 caracteres';
    }

    // Validar número de identificación
    if (!formData.idNumber.trim()) {
      newErrors.idNumber = 'El número de identificación es requerido';
    } else if (!/^\d{8,12}$/.test(formData.idNumber)) {
      newErrors.idNumber = 'El número de identificación debe tener entre 8 y 12 dígitos';
    }

    // Validar rol
    if (!formData.role) {
      newErrors.role = 'El rol es requerido';
    }

    // Validar teléfono
    if (formData.phone && !/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'El teléfono debe tener 10 dígitos';
    }

    // Validar email si se proporciona
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'El email no es válido';
    }

    // Validar proyecto si el rol es Minero
    if (formData.role === 'Minero' && !formData.project) {
      newErrors.project = 'El proyecto es requerido para mineros';
    }

    // Validar huella dactilar
    if (!formData.fingerprint) {
      newErrors.fingerprint = 'La huella dactilar es requerida';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Manejador genérico para cambios en inputs y selects
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Limpiar el error del campo que se está modificando
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
    // Si cambia el rol a algo diferente de 'Minero', limpiar el proyecto seleccionado
    if (name === 'role' && value !== 'Minero') {
        setFormData(prev => ({ ...prev, project: '' }));
    }
  };

  // Función para escanear huella dactilar
  const handleScanFingerprint = async () => {
    try {
      setScanStatus('scanning');
      setScanError(null);
      setFormData(prev => ({ ...prev, fingerprint: '' }));

      const response = await personnelService.scanFingerprint();
      setScanStatus('success');
      setFormData(prev => ({ ...prev, fingerprint: response.data.token }));
    } catch (err) {
      setScanStatus('error');
      setScanError('Error al escanear la huella dactilar');
      console.error('Error:', err);
    }
  };

  // Función para crear nuevo personal
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      // Usa el tipo correcto Employee
      const newPersonnel: Omit<Employee, 'id'> = {
        name: formData.name,
        role: formData.role,
        idNumber: formData.idNumber,
        phone: formData.phone,
        email: formData.email,
        project: formData.project,
        fingerprint: formData.fingerprint,
      };

      const response = await personnelService.create(newPersonnel);
      setPersonnel(prev => [...prev, response.data]);
      setShowForm(false);
      setFormData({
        name: '',
        role: '',
        idNumber: '',
        phone: '',
        email: '',
        project: '',
        fingerprint: '',
      });
      setErrors({});
      setScanStatus('idle');
      setScanError(null);
    } catch (err) {
      console.error('Error al crear personal:', err);
      setError('Error al crear el personal');
    }
  };

  return (
    <div className="space-y-6">
      {loading && (
        <div className="flex justify-center items-center h-16">
          <Loader className="animate-spin" size={32} />
        </div>
      )}
      {error && (
        <div className="text-red-600 text-center p-4">
          {error}
        </div>
      )}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Personal</h2>
        <button
          className="flex items-center gap-2 bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700"
          onClick={() => {
            setShowForm(true);
            setFormData({
              name: '',
              role: '',
              idNumber: '',
              phone: '',
              email: '',
              project: '',
              fingerprint: '',
            });
            setScanStatus && setScanStatus('idle');
            setScanError && setScanError(null);
          }}
        >
          <PlusIcon size={16} />
          <span>Añadir Personal</span>
        </button>
      </div>

      {/* Formulario para añadir personal, mostrado condicionalmente */}
      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="font-semibold text-lg mb-4">Añadir Nuevo Personal</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Nombre Completo */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre Completo
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className={`w-full px-3 py-2 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500`}
                />
                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
              </div>

              {/* Número de Identificación */}
              <div>
                <label htmlFor="idNumber" className="block text-sm font-medium text-gray-700 mb-1">
                  Número de Identificación
                </label>
                <input
                  type="text"
                  id="idNumber"
                  name="idNumber"
                  value={formData.idNumber}
                  onChange={handleChange}
                  required
                  className={`w-full px-3 py-2 border ${errors.idNumber ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500`}
                />
                {errors.idNumber && <p className="mt-1 text-sm text-red-600">{errors.idNumber}</p>}
              </div>

              {/* Rol */}
              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                  Rol
                </label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  required
                  className={`w-full px-3 py-2 border ${errors.role ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500`}
                >
                  <option value="">Seleccionar rol</option>
                  <option value="Supervisor">Supervisor</option>
                  <option value="Minero">Minero</option>
                  <option value="Operador">Operador</option>
                </select>
                {errors.role && <p className="mt-1 text-sm text-red-600">{errors.role}</p>}
              </div>

              {/* Teléfono */}
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Teléfono
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border ${errors.phone ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500`}
                />
                {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
              </div>

              {/* Sección Seleccionar Proyecto - Se muestra SOLO SI el rol es 'Minero' */}
              {formData.role === 'Minero' && (
                <div>
                  <label htmlFor="project" className="block text-sm font-medium text-gray-700 mb-1">
                    Seleccionar Proyecto
                  </label>
                  <select
                    id="project"
                    name="project"
                    value={formData.project}
                    onChange={handleChange}
                    required={formData.role === 'Minero'}
                    className={`w-full px-3 py-2 border ${errors.project ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500`}
                  >
                    <option value="">Seleccionar Proyecto</option>
                    <option value="Mina Norte">Mina Norte</option>
                    <option value="Proyecto Sur">Proyecto Sur</option>
                    <option value="Excavación Este">Excavación Este</option>
                    <option value="Mina Occidental">Mina Occidental</option>
                    <option value="Proyecto Central">Proyecto Central</option>
                  </select>
                  {errors.project && <p className="mt-1 text-sm text-red-600">{errors.project}</p>}
                </div>
              )}

              {/* Sección de Lectura de Huella Dactilar - Más visual */}
              <div className="col-span-1 md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Huella Dactilar
                </label>
                <FingerprintScanner
                  onScanComplete={(token) => {
                    setFormData(prev => ({ ...prev, fingerprint: token }));
                    if (errors.fingerprint) {
                      setErrors(prev => ({ ...prev, fingerprint: undefined }));
                    }
                  }}
                  onScanError={(error) => {
                    setErrors(prev => ({ ...prev, fingerprint: error }));
                  }}
                  disabled={false}
                />
                {errors.fingerprint && <p className="mt-1 text-sm text-red-600">{errors.fingerprint}</p>}
              </div>
              {/* Fin Sección de Lectura de Huella Dactilar */}

               {/* Campo Email - Añadir input si es necesario usarlo (comentado) */}
               {/* <div>
                 <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                   Email
                 </label>
                 <input
                   type="email"
                   id="email"
                   name="email"
                   value={formData.email}
                   onChange={handleChange}
                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                 />
               </div> */}


            </div>
            <div className="flex justify-end gap-2 pt-4">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700"
              >
                Guardar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Sección de Búsqueda */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <SearchIcon size={18} className="text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Buscar personal..."
          className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-gray-500"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Tabla de Personal */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nombre
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rol
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Proyecto
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredPersonnel.map(person => (
              <tr key={person.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                      <UserIcon size={18} className="text-gray-500" />
                    </div>
                    <div className="ml-4">
                      <div className="font-medium text-gray-900">
                        {person.name}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-gray-500">{person.role}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-gray-500">{person.project}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      person.project ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {person.project ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <button className="p-1 rounded-full hover:bg-gray-100">
                    <EditIcon size={18} className="text-gray-500" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};