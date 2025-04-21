import { z } from "zod";

export const ModuloSchema = z.object({
    id_modulo : z.number().default(0),
    nombre : z.string().min(5,"Mínimo 5 caracteres"),
    descripcion : z.string().min(5,"Mínimo 5 caracteres"),
    estado : z.boolean().default(true)
})

export type Modulo = z.infer<typeof ModuloSchema>

export const ModuloUpdateSchema = z.object({
    id_modulo : z.number(),
    nombre : z.string().min(5,"Mínimo 5 caracteres"),
    descripcion : z.string().min(5,"Mínimo 5 caracteres")
})

export type ModuloUpdate = z.infer<typeof ModuloUpdateSchema>
