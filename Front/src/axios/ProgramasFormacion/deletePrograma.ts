import { axiosAPI } from "../axiosAPI";

export async function deletePrograma(id_programa:number):Promise<any> {
    await axiosAPI.put(`programaFormacion/estado/${id_programa}`);
    return id_programa;
}