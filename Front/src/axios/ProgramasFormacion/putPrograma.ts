import { axiosAPI } from "../axiosAPI";

export interface ProgramaPutData {
  id_programa?: number;
  nombre: string;
  estado: boolean;
  created_at?: string;
  updated_at?: string;
  fk_area: number;
}

export async function putPrograma(id:number, data:ProgramaPutData):Promise<any> {
    const res = await axiosAPI.put(`programaFormacion/${id}`, data);
    return res.data
}