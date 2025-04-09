import { z } from "zod";

export const RolSchema = z.object({
  nombre: z.string({
    required_error: "El nombre es obligatorio",
    invalid_type_error: "Debe ser de tipo String",
  }),

  estado: z.boolean({ required_error: "El estado es requerido" }),
});

export type Rol = z.infer<typeof RolSchema>