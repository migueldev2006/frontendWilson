import { axiosAPI } from "../axiosAPI";

export interface ProgramaPostData {
  id_programa?: number;
  nombre: string;
  estado: boolean;
  created_at?: string;
  updated_at?: string;
  fk_area: number;
}

export async function postPrograma(data:ProgramaPostData):Promise<any> {
    const res = await axiosAPI.post(`programaFormacion`, data);
    return res.data
}
