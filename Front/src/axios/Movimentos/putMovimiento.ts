import { axiosAPI } from "../axiosAPI";

export interface MovimientoPutData {
  id_movimiento?: number;
  descripcion: string;
  cantidad: number;
  hora_ingreso: string;
  hora_salida: string;
  aceptado: boolean;
  en_proceso: boolean;
  cancelado: boolean;
  devolutivo: boolean;
  no_devolutivo: boolean;
  created_at?: string;
  updated_at?: string;
  fk_usuario: number;
  fk_tipo_movimiento: number;
  fk_sitio: number;
  fk_inventario: number;
}

export async function putMovimiento(id:number, data:MovimientoPutData):Promise<any> {
    const res = await axiosAPI.put(`movimiento/${id}`,data);
    return res.data
}