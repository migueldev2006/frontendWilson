import { axiosAPI } from "../axiosAPI";

export interface UnidadPostData {
    id_unidad?: number;
    nombre: string;
    estado: boolean;
    created_at?:string;
    updated_at?:string;
}

export async function postUnidad(data:UnidadPostData):Promise<any> {
    const res = await axiosAPI.post(`unidad`, data);
    return res.data
}