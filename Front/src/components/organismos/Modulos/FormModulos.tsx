
import { Form } from "@heroui/form"
import { Modulo, ModuloSchema } from "@/schemas/Modulo";
import { Input, Select, SelectItem } from "@heroui/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

type FormularioProps = {

    addData: (modulos: Modulo) => Promise<void>;
    onClose: () => void;
    id: string
}

export default function FormModulos({ addData, onClose, id }: FormularioProps) {

    const {register,handleSubmit,formState: {errors}, setValue} = useForm({
        resolver : zodResolver(ModuloSchema)
    })

    const onSubmit = async (data : Modulo) => {
        try {
            console.log("Enviando formulario con datos:", data);
            await addData(data);
            console.log("Modulo guardado correctamente");

            onClose();
        } catch (error) {
            console.error("Error al cargar el modulo", error);
        }
    }

    return (
        <Form id={id} onSubmit={handleSubmit(onSubmit)} className="w-full space-y-4">

            <Input {...register("nombre")} label="Nombre" type="text"/>
            {errors.nombre && <p className="text-red-500">{errors.nombre.message}</p>}
            <Input {...register("descripcion")} label="Descripcion" type="text"/>
            {errors.descripcion && <p className="text-red-500">{errors.descripcion.message}</p>}

            <Select
                aria-labelledby="estado"
                labelPlacement="outside"
                placeholder="Estado"
                onChange={(e) => setValue("estado",e.target.value === 'true' ? true : false)}
            >
                <SelectItem key="true">Activo</SelectItem>
                <SelectItem key="false" >Inactivo</SelectItem>
            </Select>
            {errors.estado && <p className="text-red-500">{errors.estado.message}</p>}

        </Form>
    )
}