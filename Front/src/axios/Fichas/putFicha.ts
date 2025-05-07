import { axiosAPI } from "../axiosAPI";

export interface FichaPutData {
    id_ficha?: number;
    codigo_ficha: number;
    created_at?:string;
    updated_at?:string;
    estado: boolean;
    fk_programa: number;
}

export async function putFicha(id:number, data:FichaPutData):Promise<any> {
    const res = await axiosAPI.put(`fichas/${id}`, data);
    return res.data
}