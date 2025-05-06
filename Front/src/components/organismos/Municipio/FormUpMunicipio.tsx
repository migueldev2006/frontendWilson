import { Form } from "@heroui/form"
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@heroui/input";
import { useMunicipio } from "@/hooks/Municipio/useMunicipio";
import { MunicipioUP, MunicipioUPSchema } from "@/schemas/Municipio";
import { useForm } from "react-hook-form";

type Props = {
    municipios: MunicipioUP[];
    municipioId: number;
    id: string
    onclose: () => void;

}

const FormUpMunicipio = ({  municipioId, id, onclose }: Props) => {
    const { updateMunicipio, getMunicipioById } = useMunicipio()

    const foundMunicipio = getMunicipioById(municipioId) as MunicipioUP;
    console.log(foundMunicipio);

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(MunicipioUPSchema),
        defaultValues: {
            id_municipio: foundMunicipio.id_municipio,
            nombre: foundMunicipio.nombre
        }
    });

    const onSubmit = async (data: MunicipioUP) => {
        console.log("submiting...");
        console.log(data);
        try {
            await updateMunicipio(data.id_municipio, data);
            console.log("Sended success")
            onclose();
        } catch (error) {
            console.log("Error al actualizar el centro", error);
        }
    }



    return (
        <Form id={id} className="w-full space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <Input
                {...register("nombre")}
                label="Nombre"
                type="text"
                isInvalid={!!errors.nombre}
                errorMessage={errors.nombre?.message}
            />
            <button type="submit" className="bg-blue-500 text-white p-2 rounded-md">
                Guardar Cambios
            </button>
        </Form>
    )

}


export default FormUpMunicipio;