import { axiosAPI } from "../axiosAPI";

export interface MovimientoPostData {
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

export async function postMovimiento(data:MovimientoPostData):Promise<any> {
    const res = await axiosAPI.post(`movimiento`,data);
    return res.data
}
