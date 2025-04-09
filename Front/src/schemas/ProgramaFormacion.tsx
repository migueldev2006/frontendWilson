import {z} from 'zod'

export const ProgramaSchema = z.object({
  
    nombre: z
        .string({required_error:"nombre es requerido"})
        .min(3,{message:"Longitud minima de 3"}),
    estado: z
        .boolean({required_error:"Estado es requerido"}),

    fk_area: z
        .number({required_error:"area es requerido"})
})

export type Programa = z.infer<typeof ProgramaSchema>