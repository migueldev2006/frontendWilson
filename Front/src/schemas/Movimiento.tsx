import { z } from "zod";

export const MovimientoSchema = z.object({
  descripcion: z
    .string({
      required_error: "Debe agregar una descripcion, es necesaria",
      invalid_type_error: "La descripcion debe ser de tipo String",
    })
    .min(5, {
      message: "La descripcion debe contar con al menos 5 argumentos",
    }),

  cantidad: z.number({ required_error: "Cantidad es requerida" }).min(1, {
    message:
      "Debe contener por lo menos una cantidad minima de 1 para poder realizar el movimiento",
  }),

  tipoElemento: z.enum(["devolutivo", "no_devolutivo"], {
    required_error: "Debes seleccionar un tipo de elemento",
  }),

  fk_usuario: z.number({ required_error: "El Usuario es requreido" }),
  fk_tipo_movimiento: z.number({
    required_error: "El tipo de movimiento es requreido",
  }),
  fk_inventario: z.number({ required_error: "El Inventario es requreido" }),
});

export type Movimiento = z.infer<typeof MovimientoSchema>