import React, { useState, useEffect } from "react";
import { Permisos } from "@/types/permisos";
import { Form } from "@heroui/form"
import Inpu from "@/components/molecules/input";
import {usePermisos} from "@/hooks/permisos/usePermisos";



type Props = {
    permiso: Permisos[] ;
    permsoId: number;
    id: string
    onclose: () => void;

}

const FormuUpdate = ({ permiso, permsoId, id, onclose }: Props) => {
    const [formData, setFormData] = useState<Partial<Permisos>>({
        id_permiso: 0,
        permiso: ""
  
    });

    const {updatePermisos, getPermisosById} = usePermisos()

    useEffect(() => { // se ejecuta cuando algo se cambie en un usuario, obtiene el id y modifica el FormData
        const foundUser = getPermisosById(permsoId);

        if (foundUser) {
            setFormData(foundUser);
        }

    }, [permiso, permsoId]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => { //se ejecuta cuando el usuario cambia algo en un campo
        const { name, value, type, checked } = e.target;

        setFormData((prev : Partial<Permisos>) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };


    const handleSubmit = async (e : React.FormEvent) => {

        e.preventDefault();
        if (!formData.id_permiso) {
            return <p className="text-center text-gray-500">permiso no encontrado</p>;
        }
        
        try {
            await updatePermisos(formData.id_permiso, formData);
            onclose();
        } catch (error) {
            console.log("Error al actualizar el permiso", error);
        }
    }




    return (
        <Form id={id} className="w-full space-y-4" onSubmit={handleSubmit}>
            <Inpu label="permiso" placeholder="permiso" type="text" name="permiso" value={formData.permiso ?? ''} onChange={handleChange} />


            <button type="submit" className="bg-blue-500 text-white p-2 rounded-md">
                Guardar Cambios
            </button>
        </Form>
    )

}


export default FormuUpdate;