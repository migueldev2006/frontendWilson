import { TipoMovimiento } from "@/types/TipoMovimiento";
import { axiosAPI } from "../axiosAPI"

export const getTipo = async ():Promise<TipoMovimiento[]> => {
    const res = await axiosAPI.get(`tipoMovimiento`);
    return res.data;
}