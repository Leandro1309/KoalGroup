// src/types/index.ts

// Basado en tu ProyectoSerializer y modelo Proyecto
export interface Proyecto {
  id: number;
  nombre: string;
  descripcion?: string | null;
  fecha_inicio: string; // Formato YYYY-MM-DD
  estado: string;
  supervisor?: number | null; // ID del empleado supervisor
  supervisor_detalle?: Empleado | null; // Objeto Empleado (si se incluye)
  fecha_creacion: string; // Formato ISO DateTime
  // Campos que vi en tu ProjectList.tsx dummy data
  location?: string; // Asegúrate que este campo exista en tu modelo Django o serializador si lo necesitas
  personnel?: number; // Este parece ser un conteo, necesitarías calcularlo en el backend
}

// Basado en tu EmpleadoSerializer y modelo Empleado
export interface Cargo {
  id: number;
  nombre_cargo: string;
  descripcion?: string | null;
  nivel_acceso: string;
}

export interface Empleado {
  id: number;
  cargo: number; // ID del cargo
  cargo_detalle?: Cargo | null;
  cedula: string;
  nombres: string;
  telefono?: string | null;
  email?: string | null;
  estado: string;
  fecha_creacion: string;
  fecha_registro: string;
  huella?: string | null; // Asumo que el BinaryField se serializa como string (Base64)
  nivel_acceso: string;
  
  project?: string; // Si es el nombre del proyecto, considera usar proyecto_id y proyecto_detalle
  performance?: string; // Esto necesitaría un campo en el modelo o ser calculado
}


// Para formularios de creación/edición, a menudo se omiten los campos `id` y `read_only`
export type ProyectoFormData = Omit<Proyecto, 'id' | 'fecha_creacion' | 'supervisor_detalle' | 'personnel'> & {
    manager?: string; // Lo que usas en tu formulario, puede ser el ID del supervisor
    // Ajustar según los campos que realmente envías al backend
};


export interface DashboardStats {
  proyectosActivos: number;
  totalPersonal: number;
  produccionMensualEstimada: string;
  informesGenerados: number;
}

export interface ProyectoResumido {
  id: number;
  nombre: string;
  estado: string;
}

export interface ProduccionPorProyecto {
    id: number;
    nombreProyecto: string;
    porcentajeProduccion: number;
}

// --- Tipos para PersonnelList ---
export interface PersonnelFormData {
  // Basado en tu Django Empleado model y PersonnelList.tsx
  nombres: string;
  cargo: number | string; // Enviar el ID del Cargo
  cedula: string;
  telefono?: string;
  email?: string;
  // proyecto: string; // Si es asignación directa a un proyecto al crear empleado.
  // Considera si esto debe ser un ID de proyecto o cómo se maneja en el backend.
  // El modelo Empleado no tiene un campo 'project' directo.
  // La asignación a proyectos usualmente es una relación separada o a través de ControlDeIngreso/Produccion
  huella?: string; // El token simulado de la huella
  estado?: string; // Por defecto 'activo'
  nivel_acceso: string; // Podría venir del Cargo o ser específico
}

export interface Personnel extends Empleado { // Extiende Empleado para incluir los detalles
    project?: string; // Nombre del proyecto (para visualización)
    performance?: string; // (para visualización)
}

export type ScanStatus = 'idle' | 'scanning' | 'success' | 'error';


// Añade más tipos según necesites para otros modelos/formularios
export interface Cargo {
  id: number;
  nombre_cargo: string;
  descripcion?: string | null;
  nivel_acceso: string;
}

export interface Empleado {
  id: number;
  cargo: number; // ID del cargo
  cargo_detalle?: Cargo | null;
  cedula: string;
  nombres: string;
  telefono?: string | null;
  email?: string | null;
  estado: string;
  fecha_creacion: string; // ISO DateTime
  fecha_registro: string; // Date YYYY-MM-DD
  huella?: string | null; // Asumiendo Base64 string para BinaryField
  nivel_acceso: string;
  // Campos visuales que podrías necesitar poblar en el frontend
  // (no necesariamente directos del modelo Empleado):
  project?: string; // Nombre del proyecto
  performance?: string; // Rendimiento (si lo calculas o guardas en algún lado)
}

// Para el formulario de creación/edición de personal
export type EmpleadoFormData = {
  nombres: string;
  cedula: string;
  cargo: number | string; // Enviar el ID del cargo
  telefono?: string;
  email?: string;
  estado?: string; // Ej: 'activo'
  nivel_acceso?: string; // Podría venir del cargo o ser específico
  huella?: string; // El "token" de la huella
  // Si necesitas asociar un proyecto directamente al crear:
  // proyecto_id?: number | string;
};


// Para el Dashboard (ya los tenías, solo para confirmar)
export interface DashboardStatsAPI { // Asumiendo que esto viene de un endpoint específico
  proyectos_activos: number;
  total_personal: number;
  produccion_mensual_estimada: string; // ej: "1,250 t"
  informes_generados: number;
}

export interface ProyectoResumidoAPI { // Viene de /proyectos/
  id: number;
  nombre: string;
  estado: string;
  // ultimaActualizacion?: string; // ej: "hace 2 días"
}

export interface ProduccionPorProyectoAPI { // Asumiendo que esto viene de un endpoint específico
    id: number; // Podría ser el ID del proyecto
    nombre_proyecto: string;
    porcentaje_produccion: number; // 0-100
}


// Para Reportes
export interface ReportParams {
  reportType: string;
  project?: string; // projectId
  startDate?: string;
  endDate?: string;
}

export interface ReportResult { // Ejemplo de cómo podría ser un informe
  id: string | number;
  name: string;
  url?: string; // URL para descargar
  generatedDate: string;
  data?: any[]; // Datos tabulares si el informe se muestra en UI
}