import { axiosAPI } from "../axiosAPI";

export interface AreaPostData {
  id_area?: number;
  nombre: string;
  estado: boolean;
  created_at?: string;
  updated_at?: string;
  fk_usuario:number;
  fk_sede: number;
}

export async function postArea(data: AreaPostData): Promise<any> {
  const res = await axiosAPI.post("areas", data);
  return res.data;
}
