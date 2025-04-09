import {z} from 'zod'

export const FichaSchema = z.object({
  
    codigo_ficha: z
        .number({required_error:"codigo ficha es requerido"})
        .min(10,{message:"Longitud minima de 10"}),

    estado: z
        .boolean({required_error:"Estado es requerido"}),

    fk_programa: z
        .number({required_error:"Programa es requerido"})
})

export type Fichas = z.infer<typeof FichaSchema>