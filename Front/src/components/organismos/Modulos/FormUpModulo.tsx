import { Modulo, ModuloUpdate, ModuloUpdateSchema } from "@/schemas/Modulos";
import { Form } from "@heroui/form";
import { useModulo } from "@/hooks/Modulos/useModulo";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@heroui/input";



type Props = {
    modulos: Modulo[];
    moduloId: number;
    id: string
    onclose: () => void;

}

const FormUpCentro = ({  moduloId, id, onclose }: Props) => {


    const { updateModulo, getModuloById } = useModulo()

    const foundModulo = getModuloById(moduloId) as ModuloUpdate;
    console.log(foundModulo);

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(ModuloUpdateSchema),
        defaultValues: {
            id_modulo: foundModulo.id_modulo,
            nombre: foundModulo.nombre
        }
    });

    const onSubmit = async (data: ModuloUpdate) => {
        console.log("submiting...");
        console.log(data);
        try {
            await updateModulo(data.id_modulo, data);
            console.log("Sended success")
            onclose();
        } catch (error) {
            console.log("Error al actualizar el centro", error);
        }
    }

    return (
        <Form onSubmit={handleSubmit(onSubmit)} id={id} className="w-full space-y-4">
            <Input
                {...register("nombre")}
                label="Nombre"
                type="text"
                isInvalid={!!errors.nombre}
                errorMessage={errors.nombre?.message}
            />

            <Input
                {...register("descripcion")}
                label="Descripcion"
                type="text"
                isInvalid={!!errors.descripcion}
                errorMessage={errors.descripcion?.message}
            />
            <button type="submit" className="bg-blue-500 text-white p-2 rounded-md">
                Guardar Cambios
            </button>
        </Form>
    )

}


export default FormUpCentro;