import React, { useState, useEffect } from "react";
import { Ficha } from "@/types/Ficha";
import { Form } from "@heroui/form"
import Inpu from "@/components/molecules/input";
import {useFichas} from "@/hooks/fichas/useFichas";



type Props = {
    Fichas: Ficha[] ;
    fichasId: number;
    id: string
    onclose: () => void;

}

const FormuUpdate = ({ Fichas, fichasId, id, onclose }: Props) => {
    const [formData, setFormData] = useState<Partial<Ficha>>({
        id_ficha: 0,
        codigo_ficha: 0,
        estado: false,
        fk_programa: 0,
    });

    const {updateFicha, getFichaById} = useFichas()

    useEffect(() => { // se ejecuta cuando algo se cambie en un usuario, obtiene el id y modifica el FormData
        const foundFichas = getFichaById(fichasId);

        if (foundFichas) {
            setFormData(foundFichas);
        }

    }, [Fichas, fichasId]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => { //se ejecuta cuando el usuario cambia algo en un campo
        const { name, value, type, checked } = e.target;

        setFormData((prev : Partial<Ficha>) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };


    const handleSubmit = async (e : React.FormEvent) => {

        e.preventDefault();
        if (!formData.id_ficha) {
            return <p className="text-center text-gray-500">Ficha no encontrado</p>;
        }
        
        try {
            await updateFicha(formData.id_ficha, formData);
            onclose();
        } catch (error) {
            console.log("Error al actualizar la ficha", error);
        }
    }




    return (
        <Form id={id} className="w-full space-y-4" onSubmit={handleSubmit}>
         
            <Inpu label="codigo_ficha" placeholder="codigo_ficha" type="codigo_ficha" name="codigo_ficha" value={String(formData.codigo_ficha) ?? ''} onChange={handleChange} />
           
            <button type="submit" className="bg-blue-500 text-white p-2 rounded-md">
                Guardar Cambios
            </button>
        </Form>
    )

}


export default FormuUpdate;