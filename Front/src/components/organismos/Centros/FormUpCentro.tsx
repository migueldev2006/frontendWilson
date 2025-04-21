import { Centro } from "@/schemas/Centro";
import { Form } from "@heroui/form"
import { useCentro } from "@/hooks/Centros/useCentros";
import { useForm } from "react-hook-form";
import { CentroUpdate, CentroUpdateSchema } from "@/schemas/Centro";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@heroui/input";



type Props = {
    centros: (Centro & { key: string })[];
    centroId: number;
    id: string
    onclose: () => void;

}

const FormUpCentro = ({ centros, centroId, id, onclose }: Props) => {
    console.log("Todos los centros:",centros);
    
    const { updateCentro, getCentroById } = useCentro()
    const foundCentro = getCentroById(centroId) as CentroUpdate;
    console.log(foundCentro);

    const { register, handleSubmit, formState: { errors }, setValue } = useForm({
        resolver: zodResolver(CentroUpdateSchema),
        defaultValues : {
            id_centro : foundCentro.id_centro,
            nombre : foundCentro.nombre,
            fk_municipio : foundCentro.fk_municipio
        }
    });

    const onSubmit = async (data : CentroUpdate) => {
        console.log("submiting...");
        console.log(data);
        try {
            await updateCentro(data.id_centro, data);
            onclose();
        } catch (error) {
            console.log("Error al actualizar el centro", error);
        }
    }




    return (
        <Form id={id} className="w-full space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <Input {...register("nombre")} label="Nombre" type="text"/>
            {errors.nombre && <p className="text-red-500">{errors.nombre.message}</p>}

            <Input onChange={(e)=>setValue("fk_municipio",parseInt(e.target.value))} label="Municipio" type="number"/>
            {errors.fk_municipio && <p className="text-red-500">{errors.fk_municipio.message}</p>}

            <button type="submit" className="bg-blue-500 text-white p-2 rounded-md">
                Guardar Cambios
            </button>
        </Form>
    )

}


export default FormUpCentro;