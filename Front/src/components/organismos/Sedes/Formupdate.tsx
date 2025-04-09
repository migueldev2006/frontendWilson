import React, { useState, useEffect } from "react";
import { Sede } from "@/types/sedes";
import { Form } from "@heroui/form"
import Inpu from "@/components/molecules/input";
import {useSede} from "@/hooks/sedes/useSedes";



type Props = {
    sedes: Sede[] ;
    sedeId: number;
    id: string
    onclose: () => void;

}

const FormuUpdate = ({ sedes, sedeId, id, onclose }: Props) => {
    const [formData, setFormData] = useState<Partial<Sede>>({
        id_sede: 0,
        nombre: "",
        estado: true,
        fk_centro: 0,
    });

    const {updateSede, getSedeById} = useSede()

    useEffect(() => { // se ejecuta cuando algo se cambie en un usuario, obtiene el id y modifica el FormData
        const foundSede = getSedeById(sedeId);

        if (foundSede) {
            setFormData(foundSede);
        }

    }, [sedes, sedeId]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => { //se ejecuta cuando el usuario cambia algo en un campo
        const { name, value, type, checked } = e.target;

        setFormData((prev : Partial<Sede>) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };


    const handleSubmit = async (e : React.FormEvent) => {

        e.preventDefault();
        if (!formData.id_sede) {
            return <p className="text-center text-gray-500">Sede no encontrado</p>;
        }
        
        try {
            await updateSede(formData.id_sede, formData);
            onclose();
        } catch (error) {
            console.log("Error al actualizar la Sede", error);
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


export default FormuUpdate;