import { axiosAPI } from "../axiosAPI";

export async function cancelMovimiento(id_movimiento:number):Promise<any> {
    await axiosAPI.put(`movimiento/cancelar/${id_movimiento}`);
    return id_movimiento;
}