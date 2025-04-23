import {z} from 'zod'

export const CaracteristicasSchema = z.object({
    id_caracteristica : z.number().optional(),
    nombre: z
        .string({required_error:"Nombre es requerido"})
        .min(3,{message:"Longitud minima de 3"}),

    created_at : z
    .string()
    .default("")
})

export type Caracteristicas = z.infer<typeof CaracteristicasSchema>