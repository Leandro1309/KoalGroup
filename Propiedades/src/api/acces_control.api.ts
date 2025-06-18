import axios from 'axios';

/**
 * Obtiene los registros de control de acceso desde la API.
 *
 * Esta función realiza una solicitud HTTP GET a la URL especificada del backend
 * para recuperar la lista de registros de acceso de empleados.
 */

export const getAccessLogs = async () => {
    const response = await axios.get('http://127.0.0.1:8000/api/v1/ControlDeAcceso/');
    return response.data;
}

/**
 * Elimina un registro de control de acceso por su ID
 * 
 */

export const deleteAccessLog = async (id: number) => {
    await axios.delete(`http://127.0.0.1:8000/api/v1/ControlDeAcceso/${id}/`);
}

/**
 *Obtiene el nombre del empleado por número de cédula *
 */

export const getEmployeeNameByCedula = async (cedula: string) => {
    const response = await axios.get(`http://127.0.0.1:8000/api/v1/buscar-empleado/?cedula=${cedula}`)
    return response.data.nombre
}

/**
 * Obtiene el área de trabajo previa de un empleado por su número de cédula.
 *
 * Esta función realiza una solicitud HTTP GET al endpoint del backend que busca
 * el último registro de área de trabajo asociado a la cédula proporcionada.
 *
 * @param cedula - Número de cédula del empleado (como string).
 * @returns Una promesa que resuelve con el nombre del área de trabajo (string) si existe.
 */
export const getAreaByCedula = async (cedula: string) => {
    const response = await axios.get(`http://127.0.0.1:8000/api/v1/buscar_area_por_cedula/?cedula=${cedula}`);
    return response.data.area;
}


/**
 * Está función hace una petición GET al backend que busca a los empleados por cedula y por nombres 
 */

export const filterAccessLogs = async (cedula: string, nombres: string) => {
    const response = await axios.get(
        `http://127.0.0.1:8000/api/v1/filtro_de_busqueda/?cedula=${cedula}&nombres=${nombres}`
    );
    return response.data;
}