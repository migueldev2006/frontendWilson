export type Solicitud = {
  id_solicitud: number;
  descripcion: string;
  cantidad: number;
  aceptada: boolean;
  pendiente: boolean;
  rechazada: boolean;
  created_at:string;
  updated_at:string;
  fk_usuario: number;
  fk_inventario: number;
};
