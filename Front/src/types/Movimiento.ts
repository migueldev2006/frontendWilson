export type Movimiento = {
  id_movimiento: number;
  descripcion: string;
  cantidad: number;
  hora_ingreso: string;
  hora_salida: string;
  estado: boolean;
  aceptado: boolean;
  en_proceso: boolean;
  cancelado: boolean;
  devolutivo: boolean;
  no_devolutivo: boolean;
  created_at: string;
  updated_at: string;
  fk_usuario: number;
  fk_tipo_movimiento: number;
  fk_sitio: number;
  fk_inventario: number;
  tipo_movimiento: string;
};

export type MovimientoResumen = {
  area: string;
  nombre: string;
  stock_total: number;
  total_usos: number;
  porcentaje_uso: number;
};

export type MovimientoMes = {
  tipo_movimiento: string;
  mes: string;
  area:string;
  elemento:string;
  total: number;
};
