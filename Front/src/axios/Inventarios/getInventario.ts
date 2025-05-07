import { Inventario } from "@/types/Inventario";
import { axiosAPI } from "../axiosAPI";

export const getInventario = async():Promise<Inventario[]> =>{
    const res = await axiosAPI.get(`inventario`);
    return res.data
}