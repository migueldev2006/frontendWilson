import { axiosAPI } from "../axiosAPI";

export async function deleteFicha(id_ficha:number):Promise<any> {
    await axiosAPI.put(`fichas/estado/${id_ficha}`);
    return id_ficha;
}