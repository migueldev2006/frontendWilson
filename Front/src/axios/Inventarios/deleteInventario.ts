import { axiosAPI } from "../axiosAPI";

export async function deleteInventario(id_inventario:number):Promise<any> {
    await axiosAPI.put(`inventario/cambiarEstado/${id_inventario}`);
    return id_inventario;
}