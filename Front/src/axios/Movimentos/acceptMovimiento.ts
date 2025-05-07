import { axiosAPI } from "../axiosAPI";

export async function acceptMovimiento(id_movimiento:number):Promise<any> {
    await axiosAPI.put(`movimiento/aceptar/${id_movimiento}`);
    return id_movimiento;
}