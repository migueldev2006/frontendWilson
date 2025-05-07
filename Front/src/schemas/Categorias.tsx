import { z } from "zod";

export const CategoriaSchema = z.object({
    id_categoria : z.number().optional(),
    nombre : z.string().min(1,{message : "Es necesario un nombre"}).min(3,"Mínimo 3 caracteres"),
    estado: z
        .boolean({ required_error: "Estado es requerido" }),

})

export type Categoria = z.infer<typeof CategoriaSchema>;

export const CategoriaUpdateSchema = z.object({
    id_categoria : z.number(),
    nombre : z.string().min(1,{message : "Es necesario un nombre"}).min(3,"Mínimo 3 caracteres"),
})

export type CategoriaUpdate = z.infer<typeof CategoriaUpdateSchema>