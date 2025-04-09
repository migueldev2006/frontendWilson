import { z } from "zod";

export const InventarioSchema = z.object({
  stock: z.number().optional().default(0),

  estado: z.boolean({ required_error: "Debe seleccionar una opcion" }),

  fk_sitio: z.number({ required_error: "Sitio es obligatorio" }),

  fk_elemento: z.number({ required_error: "El Elemento es requreido" }),
});

export type Inventario = z.infer<typeof InventarioSchema>