import {z} from 'zod'

export const SedeSchema = z.object({

    nombre: z
        .string({required_error:"Nombre es requerido"})
        .min(3,{message:"Longitud minima de 3"}),
    estado: z
        .boolean({required_error:"Estado es requerido"}),
  
    fk_centro: z
        .number({required_error:"Centro es requerido"})
})

export type Sede = z.infer<typeof SedeSchema>