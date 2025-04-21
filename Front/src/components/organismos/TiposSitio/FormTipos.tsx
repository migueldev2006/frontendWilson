import { Form } from "@heroui/form"
import { TipoSitio, TipoSitioSchema } from "@/schemas/TipoSitio";
import { Input, Select, SelectItem } from "@heroui/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

type FormularioProps = {

    addData: (tipos: TipoSitio) => Promise<void>;
    onClose: () => void;
    id: string
}

export default function FormTipos({ addData, onClose, id }: FormularioProps) {

    const { register, handleSubmit, formState : {errors}, setValue } = useForm({
        resolver : zodResolver(TipoSitioSchema)
    });

    const onSubmit = async (data : TipoSitio) => {
        try {
            console.log("Enviando formulario con datos:", data);
            await addData(data);
            onClose();
        } catch (error) {
            console.error("Error al cargar el tipo de sitio", error);
        }
    }

    return (
        <Form id={id} onSubmit={handleSubmit(onSubmit)} className="w-full space-y-4">

            <Input {...register("nombre")} label="Nombre" type="text" name="nombre" />
            {errors.nombre && <p className="text-red-500">{errors.nombre.message}</p>}

            <Select
                aria-labelledby="estado"
                labelPlacement="outside"
                placeholder="Estado"
                onChange={(e) => setValue("estado",e.target.value === 'true' ? true : false)} // Convierte a booleano
            >
                <SelectItem key="true">Activo</SelectItem>
                <SelectItem key="false" >Inactivo</SelectItem>
            </Select>

            
            
        </Form>
    )
}