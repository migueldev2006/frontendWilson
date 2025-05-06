import { CategoriaUpdate,CategoriaUpdateSchema, Categoria } from "@/schemas/Categorias";
import { Form } from "@heroui/form"
import { useCategoria } from "@/hooks/Categorias/useCategorias";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@heroui/input";


type Props = {
    categorias: Categoria[] ;
    categoriaId: number;
    id: string
    onclose: () => void;

}

const FormUpCentro = ({  categoriaId, id, onclose }: Props) => {
     
       const { updateCategoria, getCategoriaById } = useCategoria()
   
       const foundCategoria = getCategoriaById(categoriaId) as CategoriaUpdate ;
       console.log(foundCategoria);
   
       const { register, handleSubmit, formState: { errors } } = useForm({
           resolver: zodResolver(CategoriaUpdateSchema),
           defaultValues : {
               id_categoria : foundCategoria.id_categoria,
               nombre : foundCategoria.nombre
           }
       });
   
       const onSubmit = async (data : CategoriaUpdate) => {
           console.log("submiting...");
           console.log(data);
           try {
               await updateCategoria(data.id_categoria, data);
               console.log("Sended success")
               onclose();
           } catch (error) {
               console.log("Error al actualizar el centro", error);
           }
       }



    return (
        <Form id={id} className="w-full space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <Input 
            {...register("nombre")} 
            label="Nombre" 
            type="text"
            isInvalid={!!errors.nombre}
            errorMessage={errors.nombre?.message}
            />
            <button type="submit" className="bg-blue-500 text-white p-2 rounded-md">
                Guardar Cambios
            </button>
        </Form>
    )

}


export default FormUpCentro;