import { z } from "zod";

export const ElementoUpdateSchema = z.object({
  id_elemento: z.number(),

  nombre: z
    .string()
    .min(1, { message: "Nombre es  requerido" })
    .min(2, { message: "Debe contener como mimimo 2 caracteres" }),

  descripcion: z
    .string()
    .min(1, { message: "Descripcion es requerida" })
    .min(2, { message: "Longitud minima 2" }),

  valor: z.number({ message: "Valor es requeridoy debe ser un numero" }),

  perecedero: z.boolean(),

  no_perecedero: z.boolean(),

  estado: z.boolean({ required_error: "Estado es requerido" }),

  imagen_elemento: z.union([
    z.instanceof(File).refine((f) => f.size > 0, "Debe ser un archivo válido"),
    z.string().min(1, "Debe ser una cadena no vacía"),
    z.undefined().optional(),
  ]),

  created_at: z.string().optional(),

  updated_at: z.string().optional(),

  fecha_vencimiento: z.string({ message: "Fecha es requerida" }).optional(),

  fecha_uso: z.string({ message: "Fecha es requerida" }),

  fk_unidad_medida: z.number({ required_error: "Unidad es requerida" }),

  fk_categoria: z.number({ required_error: "Categoria es requerida" }),

  tipoElemento: z.enum(["perecedero", "no_perecedero"], {
    required_error: "Debe seleccionar un tipo de elemento",
  }),

});

export type ElementoUpdate = z.infer<typeof ElementoUpdateSchema>;

export const ElementoCreateSchema = z.object({
  id_elemento: z.number().optional(),
  
  nombre: z
    .string()
    .min(1, { message: "Nombre es  requerido" })
    .min(2, { message: "Debe contener como mimimo 2 caracteres" }),

  descripcion: z
    .string()
    .min(1, { message: "Descripcion es requerida" })
    .min(2, { message: "Longitud minima 2" }),

  valor: z.number({ message: "Valor es requeridoy debe ser un numero" }),

  perecedero: z.boolean(),

  no_perecedero: z.boolean(),

  estado: z.boolean({ required_error: "Estado es requerido" }),

  imagen_elemento: z.union([
    z.instanceof(File).refine((f) => f.size > 0, "Debe ser un archivo válido"),
    z.string().min(1, "Debe ser una cadena no vacía"),
    z.undefined(),
  ]),
  created_at: z.string().optional(),

  updated_at: z.string().optional(),

  fecha_vencimiento: z.string({ message: "Fecha es requerida" }).optional(),

  fecha_uso: z.string({ message: "Fecha es requerida" }),

  fk_unidad_medida: z.number({ required_error: "Unidad es requerida" }),

  fk_categoria: z.number({ required_error: "Categoria es requerida" }),

  tipoElemento: z.enum(["perecedero", "no_perecedero"], {
    required_error: "Debe seleccionar un tipo de elemento",
  }),

});
export type ElementoCreate = z.infer<typeof ElementoCreateSchema>;
