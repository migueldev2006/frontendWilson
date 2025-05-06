import { axiosAPI } from "../axiosAPI";

export interface SedePostData {
    id_sede?: number;
    nombre: string;
    estado: boolean;
    created_at?:string;
    updated_at?:string;
    fk_centro: number;
}

export async function postSede(data:SedePostData):Promise<any> {
    const res = await axiosAPI.post(`sede`, data);
    return res.data
}