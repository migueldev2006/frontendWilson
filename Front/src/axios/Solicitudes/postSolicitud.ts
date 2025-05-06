import { axiosAPI } from "../axiosAPI";

export interface SolicitudPostData {
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

export async function postSolicitud(data:SolicitudPostData):Promise<any> {
    const res = await axiosAPI.post(`solicitud`, data);
    return res.data
}