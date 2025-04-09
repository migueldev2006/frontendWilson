import {z} from 'zod'

export const RolModuloSchema = z.object({

    fk_rol: z
        .number({required_error:"rolo es requerido"}),
    fk_modulo: z
        .number({required_error:"modulo es requerido"}),
    fk_permiso: z
        .number({required_error:"permiso es requerido"}),
})

export type RolModulo = z.infer<typeof RolModuloSchema>