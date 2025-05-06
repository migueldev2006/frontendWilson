import { axiosAPI } from "../axiosAPI";


export async function deleteRol(id_rol:number):Promise<any> {
    await axiosAPI.put(`rol/cambiarEstado/${id_rol}`);
    return id_rol ;   
}