import { Ruta, RutaUpdate, RutaUpdateSchema } from "@/schemas/Ruta";
import { Form } from "@heroui/form"
import { useRuta } from "@/hooks/Rutas/useRuta";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@heroui/input";


type Props = {
    rutas: Ruta[] ;
    rutaId: number;
    id: string
    onclose: () => void;

}

const FormUpRutas = ({ rutas, rutaId, id, onclose }: Props) => {

    console.log("Datos anteriores: ",rutas);
    
    const { updateRuta, getRutaById} = useRuta();
    
    const foundRuta = getRutaById(rutaId);

    const {register, handleSubmit, formState : {errors} } = useForm({
        resolver : zodResolver(RutaUpdateSchema),
        defaultValues : {
            ...foundRuta
        }
    });

    const onSubmit = async (data : RutaUpdate) => {
        try {
            await updateRuta(data.id_ruta, data);
            onclose();
        } catch (error) {
            console.log("Error al actualizar la ruta", error);
        }
    };




    return (
        <Form id={id} className="w-full space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <Input {...register("nombre")} label="Nombre" type="text"/>
            {errors.nombre && <p className="text-red-500">{errors.nombre.message}</p>}
            <Input {...register("descripcion")} label="Descripcion" type="text"/>
            {errors.descripcion && <p className="text-red-500">{errors.descripcion.message}</p>}
            <Input {...register("url_destino")} label="Url destino" type="text"/>
            {errors.url_destino && <p className="text-red-500">{errors.url_destino.message}</p>}
            <button type="submit" className="bg-blue-500 text-white p-2 rounded-md">
                Guardar Cambios
            </button>
        </Form>
    )

}


export default FormUpRutas;