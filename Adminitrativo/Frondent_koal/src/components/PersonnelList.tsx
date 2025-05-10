import React, { useState, useEffect, useCallback } from 'react';
import { SearchIcon, PlusIcon, Edit2Icon, UserIcon as UserIconLucide, Fingerprint, Loader2, CheckCircle, XCircle, Trash2Icon } from 'lucide-react'; // Renombrado UserIcon para evitar conflicto
import {
  getAllPersonnel,
  createPersonnel,
  updatePersonnel,
  deletePersonnel,
  scanFingerprintAPI
} from '../servicios/personnelService';
import { Empleado, EmpleadoFormData, ScanStatus, Cargo } from '../types/index'; // Ajusta la ruta

// Asumiendo que tienes un servicio para Cargas (roles)
// import { getAllCargos } from '../services/cargoService';
// import { getAllProjectsBrief } from '../services/projectService'; // Para el select de proyectos

// Definimos la interfaz para el estado del formulario interno del componente
// que puede ser ligeramente diferente al EmpleadoFormData si manejamos cosas extra.
interface FormState extends EmpleadoFormData {
  // Campos adicionales para el formulario si son diferentes de EmpleadoFormData
}

const initialFormState: FormState = {
  nombres: '',
  cargo: '', // Se enviará como ID
  cedula: '',
  telefono: '',
  email: '',
  // proyecto_id: '', // Si se asigna proyecto al crear empleado
  huella: '',
  estado: 'activo',
  nivel_acceso: '', // Podría autocompletarse según el cargo
};


export const PersonnelList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [personnelList, setPersonnelList] = useState<Empleado[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [formError, setFormError] = useState<string | null>(null); // Error para el formulario
  const [listError, setListError] = useState<string | null>(null); // Error para la lista

  const [showForm, setShowForm] = useState(false);
  const [editingPersonnel, setEditingPersonnel] = useState<Empleado | null>(null);
  const [formData, setFormData] = useState<FormState>(initialFormState);

  const [scanStatus, setScanStatus] = useState<ScanStatus>('idle');
  const [scanError, setScanError] = useState<string | null>(null);

  // Para cargar datos de selects (cargos, proyectos)
  const [cargos, setCargos] = useState<Cargo[]>([]);
  // const [proyectos, setProyectos] = useState<ProyectoResumidoAPI[]>([]);

  const fetchPersonnel = useCallback(async () => {
    setIsLoading(true);
    setListError(null);
    try {
      // const params = searchTerm ? { search: searchTerm } : {};
      const data = await getAllPersonnel(); // Añadir params si es necesario
      setPersonnelList(data);
    } catch (err) {
      setListError('No se pudo cargar el personal.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []); // Dependencia: searchTerm si se usa

  // Cargar datos para selects
  useEffect(() => {
    // const loadCargos = async () => {
    //   try {
    //     // const cargosData = await getAllCargos();
    //     // setCargos(cargosData);
    //     // Dummy data por ahora:
    //     setCargos([
    //       { id: 1, nombre_cargo: 'Supervisor', nivel_acceso: 'alto', descripcion: '' },
    //       { id: 2, nombre_cargo: 'Minero', nivel_acceso: 'medio', descripcion: '' },
    //     ]);
    //   } catch (error) { console.error("Error loading cargos", error); }
    // };
    // const loadProyectos = async () => {
    //   try {
    //     // const proyectosData = await getAllProjectsBrief(); // Un endpoint que solo traiga id y nombre
    //     // setProyectos(proyectosData);
    //   } catch (error) { console.error("Error loading proyectos", error); }
    // };
    // loadCargos();
    // loadProyectos();
    fetchPersonnel();
  }, [fetchPersonnel]);

  useEffect(() => {
    if (editingPersonnel) {
      setFormData({
        nombres: editingPersonnel.nombres,
        cargo: editingPersonnel.cargo.toString(), // ID del cargo
        cedula: editingPersonnel.cedula,
        telefono: editingPersonnel.telefono || '',
        email: editingPersonnel.email || '',
        huella: editingPersonnel.huella || '',
        estado: editingPersonnel.estado,
        nivel_acceso: editingPersonnel.nivel_acceso || '',
        // proyecto_id: editingPersonnel.proyecto_id?.toString() || '', // Si aplica
      });
      setScanStatus(editingPersonnel.huella ? 'success' : 'idle');
    } else {
      setFormData(initialFormState);
      setScanStatus('idle');
    }
  }, [editingPersonnel, showForm]);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Lógica adicional, ej: si cambia el rol, limpiar proyecto o nivel_acceso
    // if (name === 'cargo') {
    //   const selectedCargo = cargos.find(c => c.id.toString() === value);
    //   if (selectedCargo) {
    //     setFormData(prev => ({ ...prev, nivel_acceso: selectedCargo.nivel_acceso }));
    //     if (selectedCargo.nombre_cargo !== 'Minero') {
    //        // setFormData(prev => ({ ...prev, proyecto_id: '' }));
    //     }
    //   }
    // }
  };

  const handleScanFingerprint = async () => {
    setScanStatus('scanning');
    setScanError(null);
    setFormData(prev => ({ ...prev, huella: '' }));

    try {
        const result = await scanFingerprintAPI(editingPersonnel?.id.toString()); // Pasar ID si es para un usuario existente
        setScanStatus('success');
        setFormData(prev => ({ ...prev, huella: result.fingerprintId }));
    } catch (err: any) {
        setScanStatus('error');
        setScanError(err.message || 'Error en el escaneo.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setIsLoading(true); // Puede ser un loader específico para el form

    if (scanStatus !== 'success' && !formData.huella) { // Validar si la huella es obligatoria
        // setFormError('Por favor, escanee la huella dactilar.');
        // setIsLoading(false);
        // return;
        console.warn("Huella no escaneada, pero se permite continuar (ajustar si es obligatorio)");
    }

    const dataToSubmit: EmpleadoFormData = { ...formData };
    // Asegúrate que el ID del cargo es un número
    if (typeof dataToSubmit.cargo === 'string') {
        dataToSubmit.cargo = parseInt(dataToSubmit.cargo, 10);
    }


    try {
      if (editingPersonnel) {
        await updatePersonnel(editingPersonnel.id, dataToSubmit);
      } else {
        await createPersonnel(dataToSubmit);
      }
      setShowForm(false);
      setEditingPersonnel(null);
      fetchPersonnel(); // Recargar lista
      // Mostrar toast de éxito
    } catch (err: any) {
      setFormError(err.response?.data?.detail || err.message || 'Error al guardar el personal.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddNew = () => {
    setEditingPersonnel(null);
    setFormData(initialFormState);
    setScanStatus('idle');
    setScanError(null);
    setFormError(null);
    setShowForm(true);
  };

  const handleEdit = (person: Empleado) => {
    setEditingPersonnel(person);
    setFormError(null);
    setShowForm(true);
  };

  const handleDelete = async (personId: number) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar a esta persona?')) {
      try {
        await deletePersonnel(personId);
        fetchPersonnel(); // Recargar lista
        // Mostrar toast de éxito
      } catch (err: any) {
        setListError(err.response?.data?.detail || err.message || 'Error al eliminar el personal.');
        console.error(err);
      }
    }
  };

  const filteredPersonnel = personnelList.filter(person =>
    person.nombres.toLowerCase().includes(searchTerm.toLowerCase()) ||
    person.cargo_detalle?.nombre_cargo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    person.cedula.includes(searchTerm) // Asumimos que cédula es string
    // (person.project && person.project.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Renderizado
  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Personal</h2>
        <button
          className="flex items-center gap-2 bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700"
          onClick={handleAddNew}
        >
          <PlusIcon size={16} />
          <span>Añadir Personal</span>
        </button>
      </div>

      {listError && (
          <div className="my-4 p-3 bg-red-50 text-red-700 border border-red-200 rounded-md">
              {listError}
          </div>
      )}

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-lg">{editingPersonnel ? 'Editar Personal' : 'Añadir Nuevo Personal'}</h3>
            <button onClick={() => setShowForm(false)} className="p-2 hover:bg-gray-100 rounded-full">
              <XCircle size={20} className="text-gray-500" />
            </button>
          </div>
          {formError && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 border border-red-200 rounded-md">
              {formError}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Nombre Completo */}
              <div>
                <label htmlFor="nombres" className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre Completo <span className="text-red-500">*</span>
                </label>
                <input type="text" id="nombres" name="nombres" value={formData.nombres} onChange={handleChange} required className="w-full input-class" />
              </div>
              {/* Número de Identificación (Cédula) */}
              <div>
                <label htmlFor="cedula" className="block text-sm font-medium text-gray-700 mb-1">
                  Cédula <span className="text-red-500">*</span>
                </label>
                <input type="text" id="cedula" name="cedula" value={formData.cedula} onChange={handleChange} required className="w-full input-class" />
              </div>
              {/* Rol (Cargo) */}
              <div>
                <label htmlFor="cargo" className="block text-sm font-medium text-gray-700 mb-1">
                  Cargo <span className="text-red-500">*</span>
                </label>
                <select id="cargo" name="cargo" value={formData.cargo} onChange={handleChange} required className="w-full input-class">
                  <option value="">Seleccionar cargo</option>
                  {/* {cargos.map(cargo => (
                    <option key={cargo.id} value={cargo.id}>{cargo.nombre_cargo}</option>
                  ))} */}
                  {/* Dummy data para cargos si no los cargas aún */}
                   <option value="1">Supervisor</option>
                   <option value="2">Minero</option>
                </select>
              </div>
              {/* Teléfono */}
              <div>
                <label htmlFor="telefono" className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                <input type="tel" id="telefono" name="telefono" value={formData.telefono} onChange={handleChange} className="w-full input-class" />
              </div>
              {/* Email */}
               <div>
                 <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                 <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} className="w-full input-class" />
               </div>
               {/* Estado */}
                <div>
                    <label htmlFor="estado" className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                    <select id="estado" name="estado" value={formData.estado} onChange={handleChange} className="w-full input-class">
                        <option value="activo">Activo</option>
                        <option value="inactivo">Inactivo</option>
                        <option value="vacaciones">Vacaciones</option>
                    </select>
                </div>


              {/* Sección Seleccionar Proyecto - Condicional (ejemplo) */}
              {/* {formData.cargo && cargos.find(c=>c.id.toString() === formData.cargo)?.nombre_cargo === 'Minero' && (
                <div>
                  <label htmlFor="proyecto_id" className="block text-sm font-medium text-gray-700 mb-1">
                    Asignar a Proyecto
                  </label>
                  <select
                    id="proyecto_id"
                    name="proyecto_id"
                    value={formData.proyecto_id}
                    onChange={handleChange}
                    // required={cargos.find(c=>c.id.toString() === formData.cargo)?.nombre_cargo === 'Minero'}
                    className="w-full input-class"
                  >
                    <option value="">Seleccionar Proyecto</option>
                    {proyectos.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
                  </select>
                </div>
              )} */}

              {/* Sección de Lectura de Huella Dactilar */}
              <div className="col-span-1 md:col-span-2">
                 <label className="block text-sm font-medium text-gray-700 mb-1">Huella Dactilar</label>
                 <div className="flex items-center gap-4">
                     <button
                        type="button"
                        onClick={handleScanFingerprint}
                        disabled={scanStatus === 'scanning' || scanStatus === 'success'}
                        className={`flex items-center gap-2 px-4 py-2 rounded transition-colors ${
                            scanStatus === 'scanning' ? 'bg-gray-400 cursor-not-allowed' :
                            scanStatus === 'success' ? 'bg-green-500 text-white cursor-not-allowed' :
                            'bg-gray-800 text-white hover:bg-gray-700'
                        }`}
                     >
                         {scanStatus === 'scanning' ? <Loader2 size={20} className="animate-spin" /> :
                          scanStatus === 'success' ? <CheckCircle size={20} /> :
                          <Fingerprint size={20} />}
                         <span>
                             {scanStatus === 'scanning' ? 'Escaneando...' :
                              scanStatus === 'success' ? 'Huella Capturada' :
                              'Escanear Huella'}
                         </span>
                     </button>
                     {scanStatus === 'success' && formData.huella && (
                         <span className="text-sm text-green-600 flex items-center gap-1">
                             ID: {formData.huella.substring(0,20)}...
                         </span>
                     )}
                     {scanStatus === 'error' && scanError && (
                         <span className="text-sm text-red-600 flex items-center gap-1">
                             <XCircle size={16} /> {scanError}
                         </span>
                     )}
                     {scanStatus === 'idle' && !formData.huella && (
                          <span className="text-sm text-gray-500">Presione para escanear.</span>
                     )}
                 </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">Cancelar</button>
              <button type="submit" disabled={isLoading} className="btn-primary">
                {isLoading ? <Loader2 size={16} className="animate-spin" /> : null}
                {editingPersonnel ? 'Actualizar' : 'Guardar'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Sección de Búsqueda */}
      <div className="relative">
        {/* ... input de búsqueda ... */}
      </div>

      {/* Tabla de Personal */}
      {isLoading && personnelList.length === 0 && (
        <div className="flex justify-center items-center h-40"><Loader2 size={32} className="animate-spin text-gray-500" /> Cargando personal...</div>
      )}
      {!isLoading && filteredPersonnel.length === 0 && (
        <p className="text-gray-500 text-center py-4">No se encontró personal o no hay datos.</p>
      )}
      {filteredPersonnel.length > 0 && (
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="table-header">Nombre</th>
                <th className="table-header">Cédula</th>
                <th className="table-header">Cargo</th>
                <th className="table-header">Estado</th>
                {/* <th className="table-header">Proyecto</th> */}
                {/* <th className="table-header">Rendimiento</th> */}
                <th className="table-header">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPersonnel.map(person => (
                <tr key={person.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                        <UserIconLucide size={18} className="text-gray-500" />
                      </div>
                      <div className="ml-4">
                        <div className="font-medium text-gray-900">{person.nombres}</div>
                        <div className="text-sm text-gray-500">{person.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{person.cedula}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{person.cargo_detalle?.nombre_cargo || person.cargo}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                     <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        person.estado === 'activo' ? 'bg-green-100 text-green-800' :
                        person.estado === 'inactivo' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'}`}>
                        {person.estado}
                     </span>
                  </td>
                  {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{person.project || 'N/A'}</td> */}
                  {/* <td className="px-6 py-4 whitespace-nowrap"> ... rendimiento ... </td> */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 space-x-2">
                    <button onClick={() => handleEdit(person)} title="Editar" className="p-1 rounded-full hover:bg-yellow-100 text-yellow-600">
                      <Edit2Icon size={18} />
                    </button>
                    <button onClick={() => handleDelete(person.id)} title="Eliminar" className="p-1 rounded-full hover:bg-red-100 text-red-600">
                      <Trash2Icon size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

// Define input-class y btn-primary/secondary en tu index.css global o donde corresponda.
// Ejemplo:
// .input-class { @apply w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500; }
// .btn-primary { @apply flex items-center gap-2 bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700 disabled:bg-gray-500; }
// .btn-secondary { @apply px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50; }
// .table-header { @apply px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider; }