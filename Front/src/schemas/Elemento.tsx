import { z } from "zod";

export const ElementoSchema = z.object({
  nombre: z
    .string({
      required_error: "El nombre es requerido",
      invalid_type_error: "El nombre debe ser un String",
    })
    .min(1, { message: "El nombre debe contener un argumento por lo menos" }),

  estado: z.boolean({
    required_error: "El estado es requirido, por favor seleccione una opcion",
  }),

  imagen_elemento: z.string({ required_error: "La imagen es obligatoria" }),

  fk_unidad_medida: z.number({ required_error: "Unidad es requerida" }),
  fk_categoria: z.number({ required_error: "Categoria es requerida" }),
  fk_caracteristica: z.number({
    required_error: "Caracteristica es requerida",
  }),
});
export type Elemento = z.infer<typeof ElementoSchema>;
