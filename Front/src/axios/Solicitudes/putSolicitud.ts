import { axiosAPI } from "../axiosAPI";

export interface SolicitudPutData {
    id_solicitud?: number;
    descripcion: string;
    cantidad: number;
    aceptada: boolean;
    pendiente: boolean;
    rechazada: boolean;
    created_at?:string;
    updated_at?:string;
    fk_sitio:number
    fk_usuario: number;
    fk_inventario: number;
}

export async function putSolicitud(id:number, data:SolicitudPutData):Promise<any> {
    const res = await axiosAPI.put(`solicitud/${id}`, data);
    return res.data
}