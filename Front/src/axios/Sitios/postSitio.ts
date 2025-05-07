import { axiosAPI } from "../axiosAPI";

export interface SitioPostData {
    id_sitio?: number;
    nombre: string;
    persona_encargada: string;
    ubicacion: string;
    estado: boolean;
    created_at?:string;
    updated_at?:string;
    fk_tipo_sitio: number;
    fk_area: number;
}

export async function postSitio(data:SitioPostData):Promise<any> {
    const res = await axiosAPI.post(`sitio`, data);
    return res.data
}