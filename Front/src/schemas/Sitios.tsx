import {z} from 'zod'

export const SitioSchema = z.object({

    nombre: z
        .string({required_error:"Nombre es requerido"})
        .min(3,{message:"Longitud minima de 3"}),
    persona_encargada: z
        .string({required_error:"persona_encargada es requerido"})
        .min(3,{message:"Longitud minima de 3"}),

    ubicacion: z
        .string({required_error:"ubicacion es requerido"})
        .min(3,{message:"Longitud minima de 3"}),
    estado: z
        .boolean({required_error:"Estado es requerido"}),
    cargo: z
        .string({required_error:"Cargo es requerido"}),
    fk_tipo_sitio: z
        .number({required_error:"tipo sitio es requerido"}),
    fk_area: z
        .number({required_error:"area es requerido"})
})

export type Sitio = z.infer<typeof SitioSchema>