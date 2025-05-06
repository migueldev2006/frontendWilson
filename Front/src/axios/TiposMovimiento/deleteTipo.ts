import { axiosAPI } from "../axiosAPI";

export async function deleteTipo(id_tipo:number):Promise<any> {
    await axiosAPI.put(`tipoMovimiento/cambiarEstado/${id_tipo}`);
    return id_tipo;
}