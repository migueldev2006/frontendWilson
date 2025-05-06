import { z } from "zod";

export const CaracteristicaCreateSchema = z.object({
  id_caracteristica: z.number().optional(),
  nombre: z
    .string()
    .min(1, { message: "Es necesario un nombre" })
    .min(3, "Mínimo 3 caracteres"),

  codigo: z
    .string({message:"Codigo debe ser un string"}).min(2,{message:"Minimo 2 caracteres"})
});

export type CaracteristicaCreate = z.infer<typeof CaracteristicaCreateSchema>;

export const CaracteristicaUpdateSchema = z.object({
  id_caracteristica: z.number(),
  nombre: z
    .string()
    .min(1, { message: "Es necesario un nombre" })
    .min(3, "Mínimo 3 caracteres"),
});

export type CaracteristicaUpdate = z.infer<typeof CaracteristicaUpdateSchema>;
