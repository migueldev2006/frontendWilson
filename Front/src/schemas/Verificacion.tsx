import { z } from "zod";

export const VerificacionSchema = z.object({
  persona_encargada: z
    .string({ required_error: "Campo obligatorio" })
    .min(4, { message: "Debe conetener como minimo 4 argumentos" }),

  persona_asignada: z
    .string({ required_error: "Campo obligatorio" })
    .min(4, { message: "Debe conetener como minimo 4 argumentos" }),

  hora_ingreso: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: "La hora debe tener el formato HH:MM",
  }),

  hora_fin: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: "La hora debe tener el formato HH:MM",
  }),

  observaciones: z
    .string()
    .transform((val) => val.trim())
    .default("Sin observaciones"),

  fk_inventario: z.number({
    required_error: "Inventario es requerida",
  }),
});

export type Verificacion = z.infer<typeof VerificacionSchema>