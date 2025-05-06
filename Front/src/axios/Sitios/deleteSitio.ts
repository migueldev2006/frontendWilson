import { axiosAPI } from "../axiosAPI";

export async function deleteSitio(id_sitio:number):Promise<any> {
    await axiosAPI.put(`sitio/estado/${id_sitio}`)
    return id_sitio;
}