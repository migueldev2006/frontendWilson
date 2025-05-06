import { z } from "zod";

export const TipoUpdateSchema = z.object({
  id_tipo: z.number(),

  nombre: z
    .string()
    .min(1, { message: "Nombre es  requerido" })
    .min(2, { message: "Debe contener como mimimo 2 caracteres" }),

  estado: z.boolean({ required_error: "Estado es requerido" }),
});

export type TipoUpdate = z.infer<typeof TipoUpdateSchema>;

export const TipoCreateSchema = z.object({
    nombre:z.string().min(1, {message:"Nombre es  requerido"}).min(2,{message:"Debe contener como mimimo 2 caracteres"}),

    estado:z.boolean({required_error:"Estado es requerido"}),
})
export type TipoCreate = z.infer<typeof TipoCreateSchema>