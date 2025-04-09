import {z} from 'zod'

export const AreasSchema = z.object({
  
    nombre: z
        .string({required_error:"Nombre es requerido"})
        .min(3,{message:"Longitud minima de 3"}),

    persona_encargada: z
        .string({required_error:"Persona encargada es requerido"})
        .min(3,{message:"Longitud minima de 3"}),

    estado: z
        .boolean({required_error:"Estado es requerido"}),

    fk_sede: z
        .number({required_error:"Sede es requerido"})
})

export type Areas = z.infer<typeof AreasSchema>