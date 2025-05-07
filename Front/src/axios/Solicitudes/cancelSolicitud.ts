import { axiosAPI } from "../axiosAPI";

export async function cancelSolicitud(id_solicitud:number):Promise<any> {
    await axiosAPI.put(`solicitud/cancelar/${id_solicitud}`);
    return id_solicitud;
}