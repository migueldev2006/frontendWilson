import { Elemento } from "@/types/Elemento";
import { axiosAPI } from "../axiosAPI";

export const getElemento = async ():Promise<Elemento[]> => {
    const res = await axiosAPI.get('elemento');
    return res.data;
}