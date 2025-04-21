import { z } from "zod";

export const RutaSchema = z.object({
    id_ruta : z.number().default(0),
    nombre : z.string({required_error : "Nombre es requerido"}).min(3,"Mínimo 3 caracteres"),
    descripcion : z.string({required_error : "Descripción requerida"}).min(3,"Mínimo 3 caracteres"),
    url_destino : z.string().min(8,"Mínimo 8 caracteres"),
    estado : z.boolean().default(true),
    fk_modulo : z.number({required_error : "Módulo requerido"})
})

export type Ruta = z.infer<typeof RutaSchema>

export const RutaUpdateSchema = z.object({
    id_ruta : z.number().default(0),
    nombre : z.string({required_error : "Nombre es requerido"}).min(3,"Mínimo 3 caracteres"),
    descripcion : z.string({required_error : "Descripción requerida"}).min(3,"Mínimo 3 caracteres"),
    url_destino : z.string().min(8,"Mínimo 8 caracteres")
})

export type RutaUpdate = z.infer<typeof RutaUpdateSchema>

