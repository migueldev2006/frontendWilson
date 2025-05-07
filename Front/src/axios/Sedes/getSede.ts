import { Sede } from "@/types/sedes";
import { axiosAPI } from "../axiosAPI";

export const getSede = async ():Promise<Sede[]> => {
    const res = await axiosAPI.get(`sede`);
    return res.data
}