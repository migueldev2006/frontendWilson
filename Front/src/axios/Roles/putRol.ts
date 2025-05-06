import { axiosAPI } from "../axiosAPI";

export interface RolPutData {
    id_rol?: number;
    nombre: string;
    estado: boolean;
    created_at?:string;
    updated_at?:string;
}

export async function putRol( id:number, data:RolPutData):Promise<any>{
    const res = await axiosAPI.put(`rol/${id}/`, data);
    return res.data;
}