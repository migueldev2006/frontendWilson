import { axiosAPI } from "../axiosAPI";

export interface AreaPutData {
  id_area?: number;
  nombre: string;
  estado: boolean;
  created_at?: string;
  updated_at?: string;
  fk_usuario:number;
  fk_sede: number;
}

export async function putArea(id: number, data: AreaPutData): Promise<any> {
  const res = await axiosAPI.put(`areas/${id}`, data);
  return res.data;
}
