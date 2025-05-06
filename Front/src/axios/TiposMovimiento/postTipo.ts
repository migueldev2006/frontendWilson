import { axiosAPI } from "../axiosAPI";

export interface TipoPostData {
    id_tipo?: number;
    nombre: string;
    estado: boolean;
    created_at?:string;
    updated_at?:string;
}

export async function postTipo(data:TipoPostData):Promise<any> {
    const res = await axiosAPI.post(`tipoMovimiento`, data);
    return res.data;
}