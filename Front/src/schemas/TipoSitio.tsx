import { z } from "zod";

export const TipoSitioSchema = z.object({
    id_tipo : z.number().optional(),
    nombre : z.string().min(1,{message : "Nombre es reqerido"}).min(4,"Mínimo 4 caracteres"),
    estado: z
    .boolean({ required_error: "Estado es requerido" }),
})

export type TipoSitio = z.infer<typeof TipoSitioSchema>

export const TipoSitioUpdateSchema = z.object({
    id_tipo : z.number(),
    nombre : z.string().min(4,"Mínimo 4 caracteres")
})

export type TipoSitioUpdate = z.infer<typeof TipoSitioUpdateSchema>