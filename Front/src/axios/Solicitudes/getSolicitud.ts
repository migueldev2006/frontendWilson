import { Solicitud } from "@/types/Solicitud";
import { axiosAPI } from "../axiosAPI";

export const getSolicitud = async ():Promise<Solicitud[]> => {
    const res = await axiosAPI.get(`solicitud`);
    return res.data
}