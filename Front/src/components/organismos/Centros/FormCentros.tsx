
import { Form } from "@heroui/form"
import { Centro, CentroSchema } from "@/schemas/Centro";
import { Input, Select, SelectItem } from "@heroui/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

type FormularioProps = {

    addData: (centros: Centro) => Promise<void>;
    onClose: () => void;
    id: string
}

export default function FormCentros({ addData, onClose, id }: FormularioProps) {

    const {register, handleSubmit, formState : { errors }, setValue } = useForm({
        resolver : zodResolver(CentroSchema)
    });

    const onSubmit = async (formData : Centro) => {
        console.log(formData);
        await addData(formData);
        onClose();
    }

    return (
        <Form id={id} onSubmit={handleSubmit(onSubmit)} className="w-full space-y-4">
            
            <Input {...register("nombre")} label="Nombre" placeholder="Nombre" type="text"/>
            {errors.nombre && <p className="text-red-500">{errors.nombre.message}</p>}

            <Select
                onChange={(e)=>  setValue("estado", e.target.value === 'true' ? true : false)}
                aria-labelledby="estado"
                labelPlacement="outside"
                placeholder="Estado"
            >
                <SelectItem key="true">Activo</SelectItem>
                <SelectItem key="false" >Inactivo</SelectItem>
            </Select>
            {errors.estado && <p className="text-red-500">{errors.estado.message}</p>}

            {/* <Inpu label="Estado" placeholder="Estado" type="checkbox" name="estado" value={formData.estado.toString()} onChange={(e) => setFormData({ ...formData, estado: e.target.checked })} /> */}

            <Input onChange={(e) =>setValue("fk_municipio",parseInt(e.target.value))} label="Municipio" placeholder="municipio" type="number"/>
            {errors.fk_municipio && <p className="text-red-500">{errors.fk_municipio.message}</p>}
        </Form>
    )
}