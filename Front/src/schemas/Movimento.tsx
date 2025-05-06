import { z } from "zod";

export const MovimientoUpdateSchema = z.object({
  id_movimiento: z.number(),

  descripcion: z
    .string()
    .min(1, { message: "Descripcion es  requerida" })
    .min(2, { message: "Debe contener como mimimo 2 caracteres" }),

  cantidad: z.number({
    required_error: "Cantidad es requerida y debe ser entero",
  }),
  hora_ingreso: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: "La hora debe tener el formato HH:mm (24h)",
  }),
  hora_salida: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: "La hora debe tener el formato HH:mm (24h)",
  }),
  
  estado: z.boolean({ required_error: "Estado es requerido" }).default(true).optional(),

  aceptado: z.boolean().default(false).optional(),

  en_proceso: z.boolean().default(true).optional(),

  cancelado: z.boolean().default(false).optional(),

  devolutivo: z.boolean().default(false).optional(),

  no_devolutivo: z.boolean().default(true).optional(),

  fecha_devolucion: z.string().nullable().optional(),

  fk_usuario: z.number({ message: "Usuario es requerido" }).optional(),

  fk_tipo_movimiento: z.number({ message: "Tipo Novimiento es requerido" }).optional(),

  fk_sitio: z.number({ message: "Sitio es requerido" }).optional(),

  fk_inventario: z.number({ message: "Inventario es requerido" }).optional(),

});

export type MovimientoUpdate = z.infer<typeof MovimientoUpdateSchema>;

export const MovimientoCreateSchema = z.object({
  descripcion: z
    .string()
    .min(1, { message: "Descripcion es  requerida" })
    .min(2, { message: "Debe contener como mimimo 2 caracteres" }),
  cantidad: z.number({
    required_error: "Cantidad es requerida y debe ser entero",
  }),

  hora_ingreso: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: "La hora debe tener el formato HH:mm (24h)",
  }),

  hora_salida: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: "La hora debe tener el formato HH:mm (24h)",
  }),

  estado: z.boolean({ required_error: "Estado es requerido" }).optional(),

  aceptado: z.boolean().default(false).optional(),

  en_proceso: z.boolean().default(true).optional(),

  cancelado: z.boolean().default(false).optional(),

  devolutivo: z.boolean().optional(),

  no_devolutivo: z.boolean().optional(),

  fecha_devolucion: z.string().nullable().optional(),

  fk_usuario: z.number({ message: "Usuario es requerido" }),

  fk_tipo_movimiento: z.number({ message: "Tipo Novimiento es requerido" }),

  fk_sitio: z.number({ message: "Sitio es requerido" }),

  fk_inventario: z.number({ message: "Inventario es requerido" }),

  tipo_bien: z.enum(["devolutivo", "no_devolutivo"], {
    required_error: "Debe seleccionar un tipo de elemento",
  }),
});
export type MovimientoCreate = z.infer<typeof MovimientoCreateSchema>;
