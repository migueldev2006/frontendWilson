import { axiosAPI } from "../axiosAPI";

export async function deleteElemento(id_elemento:number):Promise<any> {
    await axiosAPI.put(`elemento/cambiarEstado/${id_elemento}`);
    return id_elemento;
}