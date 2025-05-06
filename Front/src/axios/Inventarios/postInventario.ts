import { axiosAPI } from "../axiosAPI";

export interface InventarioPostData {
    id_inventario?: number;
    stock: number;
    estado: boolean;
    created_at?:string;
    updated_at?:string;
    fk_sitio: number;
    fk_elemento: number;
}

export async function postInventario(data:InventarioPostData):Promise<any> {
    const res = await axiosAPI.post(`inventario`, data);
    return res.data;
}