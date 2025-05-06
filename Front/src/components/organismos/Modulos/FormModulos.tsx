
import { Form } from "@heroui/form"
import { Modulo, ModuloSchema } from "@/schemas/Modulos";
import { Input, Select, SelectItem } from "@heroui/react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

type FormularioProps = {

    addData: (modulos: Modulo) => Promise<void>;
    onClose: () => void;
    id: string
}

export default function FormModulos({ addData, onClose, id }: FormularioProps) {

    const { control,register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(ModuloSchema)
    })

    const onSubmit = async (data: Modulo) => {
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
           <Controller
                control={control}
                name="estado"
                render={({ field }) => (
                    <Select
                        label="Estado"
                        placeholder="Selecciona estado"
                        {...field}
                        value={field.value ? "true" : "false"}
                        onChange={(e) => field.onChange(e.target.value === "true")}
                    >
                        <SelectItem key="true">Activo</SelectItem>
                        <SelectItem key="false">Inactivo</SelectItem>
                    </Select>
                )}
            />

        </Form>
    )
}