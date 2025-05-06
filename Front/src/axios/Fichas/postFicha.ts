import { axiosAPI } from "../axiosAPI";

export interface FichaPostData {
    id_ficha?: number;
    codigo_ficha: number;
    created_at?:string;
    updated_at?:string;
    estado: boolean;
    fk_programa: number;
}

export async function postFicha(data:FichaPostData):Promise<any> {
    const res = await axiosAPI.post(`fichas`, data);
    return res.data
}