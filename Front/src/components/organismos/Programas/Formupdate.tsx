import React, { useState, useEffect } from "react";
import { Pformacion  } from "@/types/programaFormacion";
import { Form } from "@heroui/form"
import Inpu from "@/components/molecules/input";
import {usePrograma} from "@/hooks/programas/usePrograma";



type Props = {
    programas: Pformacion [] ;
    programaId: number;
    id: string
    onclose: () => void;

}

const FormuUpdate = ({ programas, programaId, id, onclose }: Props) => {
    const [formData, setFormData] = useState<Partial<Pformacion >>({
        id_programa: 0,
        nombre: "",
        estado: false,
        fk_area: 0,
    });

    const {updatePrograma, getProgramaById} = usePrograma()

    useEffect(() => { 
        const foundPrograma = getProgramaById(programaId);

        if (foundPrograma) {
            setFormData(foundPrograma);
        }

    }, [programas, programaId]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => { 
        const { name, value, type, checked } = e.target;

        setFormData((prev : Partial<Pformacion >) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };


    const handleSubmit = async (e : React.FormEvent) => {

        e.preventDefault();
        if (!formData.id_programa) {
            return <p className="text-center text-gray-500">Usuario no encontrado</p>;
        }
        
        try {
            await updatePrograma(formData.id_programa, formData);
            onclose();
        } catch (error) {
            console.log("Error al actualizar el usuario", error);
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