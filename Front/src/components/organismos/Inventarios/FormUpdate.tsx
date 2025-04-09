import React, { useState, useEffect } from "react";
import { Form } from "@heroui/form"
import Inpu from "@/components/molecules/input";
import { Inventario } from "@/types/Inventario";
import { useInventario } from "@/hooks/Inventarios/useInventario";



type Props = {
    inventarios: Inventario[] ;
    inventarioId: number;
    id: string
    onclose: () => void;

}

export const FormUpdate = ({ inventarios, inventarioId, id, onclose }: Props) => {
    const [formData, setFormData] = useState<Partial<Inventario>>({
        id_inventario:0,
        stock:0,
        estado:true,
        created_at:"",
        updated_at:"",
        fk_sitio:0,
        fk_elemento:0
    });

    const {updateInventario, getInventarioById} = useInventario()

    useEffect(() => { // se ejecuta cuando algo se cambie en un usuario, obtiene el id y modifica el FormData
        const foundInventario = getInventarioById(inventarioId);

        if (foundInventario) {
            setFormData(foundInventario);
        }

    }, [inventarios, inventarioId]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => { //se ejecuta cuando el usuario cambia algo en un campo
        const { name, value, type, checked } = e.target;

        setFormData((prev : Partial<Inventario>) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };


    const handleSubmit = async (e : React.FormEvent) => {

        e.preventDefault();
        if (!formData.id_inventario) {
            return <p className="text-center text-gray-500">Inventario no encontrado</p>;
        }
        
        try {
            await updateInventario(formData.id_inventario, formData);
            onclose();
        } catch (error) {
            console.log("Error al actualizar el inventario", error);
        }
    }

    return (
        <Form id={id} className="w-full space-y-4" onSubmit={handleSubmit}>
            <Inpu label="Stock" placeholder="Stock" type="number" name="stock" value={String(formData.stock) ?? ''} onChange={handleChange} />
            <button type="submit" className="bg-blue-500 text-white p-2 rounded-md">
                Guardar Cambios
            </button>
        </Form>
    )

}