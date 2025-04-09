import React, { useState, useEffect } from "react";
import { Area } from "@/types/area";
import { Form } from "@heroui/form"
import Inpu from "@/components/molecules/input";
import {useAreas} from "@/hooks/areas/useAreas";



type Props = {
    areas: Area[] ;
    areaId: number;
    id: string
    onclose: () => void;

}

const FormuUpdate = ({ areas, areaId, id, onclose }: Props) => {
    const [formData, setFormData] = useState<Partial<Area>>({
        id_area: 0,
        nombre: "",
        persona_encargada: "",
        estado: false,
        fk_sede: 0,
    });

    const {updateArea, getAreaById} = useAreas()

    useEffect(() => { // se ejecuta cuando algo se cambie en un usuario, obtiene el id y modifica el FormData
        const foundArea = getAreaById(areaId);

        if (foundArea) {
            setFormData(foundArea);
        }

    }, [areas, areaId]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => { //se ejecuta cuando el usuario cambia algo en un campo
        const { name, value, type, checked } = e.target;

        setFormData((prev : Partial<Area>) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };


    const handleSubmit = async (e : React.FormEvent) => {

        e.preventDefault();
        if (!formData.id_area) {
            return <p className="text-center text-gray-500">area no encontrado</p>;
        }
        
        try {
            await updateArea(formData.id_area, formData);
            onclose();
        } catch (error) {
            console.log("Error al actualizar el area", error);
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