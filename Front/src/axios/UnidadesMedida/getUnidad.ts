import { Unidad } from "@/types/Unidad";
import { axiosAPI } from "../axiosAPI";

export const getUnidad = async ():Promise<Unidad[]> => {
    const res = await axiosAPI.get(`unidad`);
    return res.data;
}