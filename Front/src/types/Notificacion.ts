export type Notificacion = {
  id_notificacion: number;
  titulo: string;
  mensaje: string;
  en_proceso: boolean;
  fk_movimiento: number;
  fk_solicitud: number;
}

export type Respuesta = "aceptar" | "cancelar";
