import React, { useState, useEffect } from "react";
import { Sitios } from "@/types/sitios";
import { Form } from "@heroui/form"
import Inpu from "@/components/molecules/input";
import {useSitios} from "@/hooks/sitios/useSitios";



type Props = {
    sitios: Sitios[] ;
    sitioId: number;
    id: string
    onclose: () => void;

}

const FormuUpdate = ({ sitios, sitioId, id, onclose }: Props) => {
    const [formData, setFormData] = useState<Partial<Sitios>>({
        id_sitio: 0,
        nombre: "",
        persona_encargada: "",
        estado: false,
        fk_tipo_sitio: 0,
        fk_area: 0,
    });

    const {updateSitio, getSitioById} = useSitios()

    useEffect(() => { // se ejecuta cuando algo se cambie en un usuario, obtiene el id y modifica el FormData
        const foundSitio = getSitioById(sitioId);

        if (foundSitio) {
            setFormData(foundSitio);
        }

    }, [sitios, sitioId]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => { //se ejecuta cuando el usuario cambia algo en un campo
        const { name, value, type, checked } = e.target;

        setFormData((prev : Partial<Sitios>) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };


    const handleSubmit = async (e : React.FormEvent) => {

        e.preventDefault();
        if (!formData.id_sitio) {
            return <p className="text-center text-gray-500">Sitio no encontrado</p>;
        }
        
        try {
            await updateSitio(formData.id_sitio, formData);
            onclose();
        } catch (error) {
            console.log("Error al actualizar el sitio", error);
        }
    }




    return (
        <Form id={id} className="w-full space-y-4" onSubmit={handleSubmit}>
            <Inpu label="Nombre" placeholder="Nombre" type="text" name="nombre" value={formData.nombre ?? ''} onChange={handleChange} />
            <Inpu label="persona_encargada" placeholder="persona_encargada" type="text" name="persona_encargada" value={formData.persona_encargada} onChange={handleChange} />
  

            <button type="submit" className="bg-blue-500 text-white p-2 rounded-md">
                Guardar Cambios
            </button>
        </Form>
    )

}


export default FormuUpdate;