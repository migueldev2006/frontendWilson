import { axiosAPI } from "../axiosAPI";

export async function deleteUnidad(id_unidad:number):Promise<any> {
    await axiosAPI.put(`unidad/cambiarEstado/${id_unidad}`);
    return id_unidad;
}