import { axiosAPI } from "../axiosAPI";

export interface UnidadPutData {
    id_unidad?: number;
    nombre: string;
    estado: boolean;
    created_at?:string;
    updated_at?:string;
}

export async function putUnidad(id:number, data:UnidadPutData):Promise<any> {
    const res = await axiosAPI.put(`unidad/${id}`, data);
    return res.data
}