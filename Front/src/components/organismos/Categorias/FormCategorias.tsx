
import { Form } from "@heroui/form"
import { Input } from "@heroui/input";
import { Select, SelectItem } from "@heroui/react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CategoriaSchema, Categoria } from "@/schemas/Categorias";

type FormularioProps = {

    addData: (categorias: Categoria) => Promise<void>;
    onClose: () => void;
    id: string
}

export default function FormCategorias({ addData, onClose, id }: FormularioProps) {


    const {
           control,
           register,
           handleSubmit,
           formState: { errors },
       } = useForm<Categoria>({
           resolver: zodResolver(CategoriaSchema),
           mode: "onChange"
       });
   
   
       const onSubmit = async (data: Categoria) => {
           console.log(data);
           try {
               await addData(data);
               onClose();
   
           } catch (error) {
               console.error("Error al guardar:", error);
           }
       };
   

    return (
        <Form id={id} onSubmit={handleSubmit(onSubmit)} className="w-full space-y-4">
            
            <Input
                label="Nombre"
                type="text"
                placeholder="Nombre"
                {...register("nombre")}
                isInvalid={!!errors.nombre}
                errorMessage={errors.nombre?.message}
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