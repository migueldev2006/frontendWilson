import { axiosAPI } from "../axiosAPI";


export interface RolPostData {
    id_rol?: number;
    nombre: string;
    estado: boolean;
    created_at?:string;
    updated_at?:string;
}

export async function  postRol(data:RolPostData):Promise<any> {
    const res = await axiosAPI.post('rol', data);
    return res.data
}