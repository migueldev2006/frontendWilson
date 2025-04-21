import { Form } from "@heroui/form"
import { useTipoSitio } from "@/hooks/TipoSitio/useTipoSitio";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TipoSitioUpdate, TipoSitioUpdateSchema,TipoSitio } from "@/schemas/TipoSitio";
import { Input } from "@heroui/input";


type Props = {
    tipos: TipoSitio[] ;
    tipoSitioId: number;
    id: string
    onclose: () => void;

}

const FormUpTipos = ({ tipos, tipoSitioId, id, onclose }: Props) => {

    console.log("Datos anteriores:",tipos);
    
    const {updateTipo, getTipoById} = useTipoSitio()

    const foundTipoSitio = getTipoById(tipoSitioId) as TipoSitioUpdate;

    const { register, handleSubmit, formState : {errors} } = useForm({
        resolver : zodResolver(TipoSitioUpdateSchema),
        defaultValues : {
            ...foundTipoSitio
        }
    })

    const onSubmit = async ( data : TipoSitioUpdate) => {
        try {
            await updateTipo(data.id_tipo, data);
            onclose();
        } catch (error) {
            console.log("Error al actualizar el tipo de sitio", error);
        }
    }

    return (
        <Form id={id} className="w-full space-y-4" onSubmit={handleSubmit(onSubmit)}>

            <Input label="Nombre" placeholder="Nombre" type="text" {...register("nombre")} />
            {errors.nombre && <p className="text-red-500">{errors.nombre.message}</p>}

            <button type="submit" className="bg-blue-500 text-white p-2 rounded-md">
                Guardar Cambios
            </button>
        </Form>
    )

}


export default FormUpTipos;