import { z } from "zod";

export const SolicitudUpdateSchema = z.object({
  id_solicitud: z.number(),

  descripcion: z
    .string()
    .min(1, { message: "Descripcion es  requerida" })
    .min(2, { message: "Debe contener como mimimo 2 caracteres" }),

  cantidad: z.number({
    required_error: "Cantidad es requerida y debe ser entero",
  }),

  estado: z.boolean({ required_error: "Estado es requerido" }).optional(),

  aceptada: z.boolean().optional(),

  pendiente: z.boolean().optional(),

  rechazada: z.boolean().optional(),

  fk_sitio: z.number({ message: "Sitio es requerido" }).optional(),

  fk_usuario: z.number({ message: "Usuario es requerido" }).optional(),

  fk_inventario: z.number({ message: "Elemento del Inventario es requerido" }).optional(),
});

export type SolicitudUpdate = z.infer<typeof SolicitudUpdateSchema>;

export const SolicitudCreateSchema = z.object({
  descripcion: z
    .string()
    .min(1, { message: "Descripcion es  requerida" })
    .min(2, { message: "Debe contener como mimimo 2 caracteres" }),

  cantidad: z.number({
    required_error: "Cantidad es requerida y debe ser entero",
  }),

  estado: z.boolean().default(true).optional(),

  aceptada: z.boolean().default(false).optional(),

  pendiente: z.boolean().default(true).optional(),

  rechazada: z.boolean().default(false).optional(),

  fk_sitio: z.number({ message: "Sitio es requerido" }),

  fk_usuario: z.number({ message: "Usario es requerido" }),

  fk_inventario: z.number({ message: "Elemento del Inventario es requerido" }),

});
export type SolicitudCreate = z.infer<typeof SolicitudCreateSchema>;