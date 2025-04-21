import React, { useState, useEffect } from "react";
import { Municipio } from "@/types/Municipio";
import { Form } from "@heroui/form"
import Inpu from "@/components/molecules/input";
import { useMunicipio } from "@/hooks/Municipio/useMunicipio";

type Props = {
    municipios: Municipio[] ;
    municipioId: number;
    id: string
    onclose: () => void;

}

const FormUpMunicipio = ({ municipios, municipioId, id, onclose }: Props) => {
    const [formData, setFormData] = useState<Partial<Municipio>>({
        id_municipio: 0,
        nombre: "",
        departamento : "",
        estado: true,
    });

    const {updateMunicipio, getMunicipioById} = useMunicipio()

    useEffect(() => { // se ejecuta cuando algo se cambie en un usuario, obtiene el id y modifica el FormData
        const foundMunicipio = getMunicipioById(municipioId);

        if (foundMunicipio) {
            setFormData(foundMunicipio);
        }

    }, [municipios, municipioId]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => { //se ejecuta cuando el usuario cambia algo en un campo
        const { name, value, type, checked } = e.target;

        setFormData((prev : Partial<Municipio>) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };


    const handleSubmit = async (e : React.FormEvent) => {

        e.preventDefault();
        if (!formData.id_municipio) {
            return <p className="text-center text-gray-500">Municipio no encontrado</p>;
        }
        
        try {
            await updateMunicipio(formData.id_municipio, formData);
            onclose();
        } catch (error) {
            console.log("Error al actualizar el municipio", error);
        }
    }




    return (
        <Form id={id} className="w-full space-y-4" onSubmit={handleSubmit}>
            <Inpu label="Nombre" placeholder="Nombre" type="text" name="nombre" value={formData.nombre ?? ''} onChange={handleChange} />
            <Inpu label="Departamento" placeholder="Departamento" type="text" name="departamento" value={formData.departamento ?? ''} onChange={handleChange} />

            <button type="submit" className="bg-blue-500 text-white p-2 rounded-md">
                Guardar Cambios
            </button>
        </Form>
    )

}


export default FormUpMunicipio;