import { axiosAPI } from "../axiosAPI";

export interface TipoPutData {
    id_tipo?: number;
    nombre: string;
    estado: boolean;
    created_at?:string;
    updated_at?:string;
}

export async function putTipo(id:number, data:TipoPutData):Promise<any> {
    const res = await axiosAPI.put(`tipoMovimiento/${id}`, data);
    return res.data;
}