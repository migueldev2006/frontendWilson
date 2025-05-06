import { axiosAPI } from "../axiosAPI";

export interface PermisoPutData {
    id_permiso?: number;
    permiso: string;
    created_at?: string;
    updated_at?: string;
}

export async function putPermiso(id:number, data:PermisoPutData):Promise<any> {
    const res = await axiosAPI.put(`permisos/${id}`, data);
    return res.data
}