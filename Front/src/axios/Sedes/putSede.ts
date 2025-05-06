import { axiosAPI } from "../axiosAPI";

export interface SedePutData {
    id_sede?: number;
    nombre: string;
    estado: boolean;
    created_at?:string;
    updated_at?:string;
    fk_centro: number;
}

export async function putSede(id:number, data:SedePutData):Promise<any> {
    const res = await axiosAPI.put(`sede/${id}`, data);
    return res.data
}