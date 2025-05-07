import { axiosAPI } from "../axiosAPI";

export async function acceptSolicitud(id_solicitud:number):Promise<any> {
    await axiosAPI.put(`solicitud/aceptar/${id_solicitud}`);
    return id_solicitud;
}