import {z} from 'zod'

export const PermisosSchema = z.object({


    permiso: z
        .string({required_error:"permiso es requerido"})
        .min(3,{message:"Longitud minima de 3"}),



})

export type Permisos = z.infer<typeof PermisosSchema>