import React, { useState, useEffect } from "react";
import { Form } from "@heroui/form"
import Inpu from "@/components/molecules/input";
import { Rol } from "@/types/Rol";
import { useRol } from "@/hooks/Roles/useRol";



type Props = {
    roles: Rol[] ;
    rolId: number;
    id: string
    onclose: () => void;

}

export const FormUpdate = ({ roles, rolId, id, onclose }: Props) => {
    const [formData, setFormData] = useState<Partial<Rol>>({
        id_rol: 0,
        nombre: "",
        estado:true,
    });

    const {updateRol, getRolById} = useRol()

    useEffect(() => { // se ejecuta cuando algo se cambie en un usuario, obtiene el id y modifica el FormData
        const foundRol = getRolById(rolId);

        if (foundRol) {
            setFormData(foundRol);
        }

    }, [roles, rolId]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => { //se ejecuta cuando el usuario cambia algo en un campo
        const { name, value, type, checked } = e.target;

        setFormData((prev : Partial<Rol>) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };


    const handleSubmit = async (e : React.FormEvent) => {

        e.preventDefault();
        if (!formData.id_rol) {
            return <p className="text-center text-gray-500">Usuario no encontrado</p>;
        }
        
        try {
            await updateRol(formData.id_rol, formData);
            onclose();
        } catch (error) {
            console.log("Error al actualizar el rol", error);
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
