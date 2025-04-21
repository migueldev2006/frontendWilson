import { Modulo, ModuloUpdate, ModuloUpdateSchema } from "@/schemas/Modulo";
import { Form } from "@heroui/form";
import { useModulo } from "@/hooks/Modulos/useModulo";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@heroui/input";



type Props = {
    modulos: Modulo[] ;
    moduloId: number;
    id: string
    onclose: () => void;

}

const FormUpCentro = ({ modulos, moduloId, id, onclose }: Props) => {
    
    console.log("Datos anteriores",modulos);

    const {updateModulo,getModuloById} = useModulo()
        
    const foundModulo = getModuloById(moduloId) as ModuloUpdate;
    
    const {register,handleSubmit,formState : {errors}} = useForm({
        resolver : zodResolver(ModuloUpdateSchema),
        defaultValues : {
            ...foundModulo
        }
    })

    const onSubmit = async (data : ModuloUpdate) => {
        try {
            await updateModulo(data.id_modulo, data);
            onclose();
        } catch (error) {
            console.log("Error al actualizar el modulo", error);
        }
    }

    return (
        <Form onSubmit={handleSubmit(onSubmit)} id={id} className="w-full space-y-4">
            <Input {...register("nombre")} label="Nombre" type="text"/>
            {errors.nombre && <p className="text-red-500">{errors.nombre.message}</p>}
            <Input {...register("descripcion")} label="Descripcion" type="text"/>
            {errors.descripcion && <p className="text-red-500">{errors.descripcion.message}</p>}

            <button type="submit" className="bg-blue-500 text-white p-2 rounded-md">
                Guardar Cambios
            </button>
        </Form>
    )

}


export default FormUpCentro;