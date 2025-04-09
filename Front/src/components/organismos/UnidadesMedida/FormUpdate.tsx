import React, { useState, useEffect } from "react";
import { Form } from "@heroui/form"
import Inpu from "@/components/molecules/input";
import { Unidad } from "@/types/Unidad";
import { useUnidad } from "@/hooks/UnidadesMedida/useUnidad";



type Props = {
    unidades: Unidad[] ;
    unidadId: number;
    id: string
    onclose: () => void;

}

export const FormUpdate = ({ unidades, unidadId, id, onclose }: Props) => {
    const [formData, setFormData] = useState<Partial<Unidad>>({
        id_unidad: 0,
        nombre: "",
        estado:true,
    });

    const {updateUnidad, getUnidadById} = useUnidad()

    useEffect(() => { // se ejecuta cuando algo se cambie en un usuario, obtiene el id y modifica el FormData
        const foundUnidad = getUnidadById(unidadId);

        if (foundUnidad) {
            setFormData(foundUnidad);
        }

    }, [unidades, unidadId]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => { //se ejecuta cuando el usuario cambia algo en un campo
        const { name, value, type, checked } = e.target;

        setFormData((prev : Partial<Unidad>) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };


    const handleSubmit = async (e : React.FormEvent) => {

        e.preventDefault();
        if (!formData.id_unidad) {
            return <p className="text-center text-gray-500">Unidad no encontrada</p>;
        }
        
        try {
            await updateUnidad(formData.id_unidad, formData);
            onclose();
        } catch (error) {
            console.log("Error al actualizar la unidad", error);
        }
    }

    return (
        <Form id={id} className="w-full space-y-4" onSubmit={handleSubmit}>
            <Inpu label="Nombre" placeholder="Nombre" type="text" name="nombre" value={formData.nombre ?? ''} onChange={handleChange} />
            <button type="submit" className="bg-blue-500 text-white p-2 rounded-md">
                Guardar Cambios
            </button>
        </Form>
    )
}