import { z } from "zod";

export const TipoSitioSchema = z.object({
    id_tipo : z.number().optional(),
    nombre : z.string().min(4,"Mínimo 4 caracteres"),
    estado : z.boolean().default(true),
    created_at : z
    .string().default(" "),
})

export type TipoSitio = z.infer<typeof TipoSitioSchema>

export const TipoSitioUpdateSchema = z.object({
    id_tipo : z.number(),
    nombre : z.string().min(4,"Mínimo 4 caracteres")
})

export type TipoSitioUpdate = z.infer<typeof TipoSitioUpdateSchema>