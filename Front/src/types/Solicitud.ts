export type Solicitud = {
  id_solicitud?: number;
  descripcion: string;
  cantidad: number;
  estado?:boolean
  aceptada?: boolean;
  pendiente?: boolean;
  rechazada?: boolean;
  created_at?:string;
  updated_at?:string;
  fk_sitio?:number
  fk_usuario?: number;
  fk_inventario?: number;
};
