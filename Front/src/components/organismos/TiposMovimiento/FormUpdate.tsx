import React, { useState, useEffect } from "react";
import { Form } from "@heroui/form"
import Inpu from "@/components/molecules/input";
import { TipoMovimiento } from "@/types/TipoMovimiento";
import { useTipoMovimiento } from "@/hooks/TiposMovimento/useTipoMovimiento";



type Props = {
    tipos: TipoMovimiento[] ;
    tipoId: number;
    id: string
    onclose: () => void;

}

export const FormUpdate = ({ tipos, tipoId, id, onclose }: Props) => {
    const [formData, setFormData] = useState<Partial<TipoMovimiento>>({
        id_tipo: 0,
        nombre: "",
        estado:true,
    });

    const {updateTipoMovimiento, getTipoMovimientoById} = useTipoMovimiento()

    useEffect(() => { // se ejecuta cuando algo se cambie en un usuario, obtiene el id y modifica el FormData
        const foundTipoMovimiento = getTipoMovimientoById(tipoId);

        if (foundTipoMovimiento) {
            setFormData(foundTipoMovimiento);
        }

    }, [tipos, tipoId]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => { //se ejecuta cuando el usuario cambia algo en un campo
        const { name, value, type, checked } = e.target;

        setFormData((prev : Partial<TipoMovimiento>) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };


    const handleSubmit = async (e : React.FormEvent) => {

        e.preventDefault();
        if (!formData.id_tipo) {
            return <p className="text-center text-gray-500">Usuario no encontrado</p>;
        }
        
        try {
            await updateTipoMovimiento(formData.id_tipo, formData);
            onclose();
        } catch (error) {
            console.log("Error al actualizar el tipo de movimiento", error);
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
