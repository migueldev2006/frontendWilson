import { axiosAPI } from "../axiosAPI";

export interface InventarioPutData {
    id_inventario?: number;
    stock: number;
    estado: boolean;
    created_at?:string;
    updated_at?:string;
    fk_sitio: number;
    fk_elemento: number;
}

export async function putInventario(id:number, data:InventarioPutData):Promise<any> {
    const res = await axiosAPI.post(`inventario/${id}`, data);
    return res.data;
}