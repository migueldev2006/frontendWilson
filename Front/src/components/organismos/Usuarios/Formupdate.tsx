import React, { useState, useEffect } from "react";
import { User } from "@/types/Usuario";
import { Form } from "@heroui/form"
import Inpu from "@/components/molecules/input";
import {useUsuario} from "@/hooks/Usuarios/useUsuario";



type Props = {
    users: User[] ;
    userId: number;
    id: string
    onclose: () => void;

}

const FormuUpdate = ({ users, userId, id, onclose }: Props) => {
    const [formData, setFormData] = useState<Partial<User>>({
        id_usuario: 0,
        documento: 0,
        nombre: "",
        apellido: "",
        edad: 0,
        telefono: "",
        correo: "",
        estado: false,
        cargo: "",
        password: "",
        fk_rol: 0,
    });

    const {updateUser, getUserById} = useUsuario()

    useEffect(() => { // se ejecuta cuando algo se cambie en un usuario, obtiene el id y modifica el FormData
        const foundUser = getUserById(userId);

        if (foundUser) {
            setFormData(foundUser);
        }

    }, [users, userId]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => { //se ejecuta cuando el usuario cambia algo en un campo
        const { name, value, type, checked } = e.target;

        setFormData((prev : Partial<User>) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };


    const handleSubmit = async (e : React.FormEvent) => {

        e.preventDefault();
        if (!formData.id_usuario) {
            return <p className="text-center text-gray-500">Usuario no encontrado</p>;
        }
        
        try {
            await updateUser(formData.id_usuario, formData);
            onclose();
        } catch (error) {
            console.log("Error al actualizar el usuario", error);
        }
    }




    return (
        <Form id={id} className="w-full space-y-4" onSubmit={handleSubmit}>
            <Inpu label="Nombre" placeholder="Nombre" type="text" name="nombre" value={formData.nombre ?? ''} onChange={handleChange} />
            <Inpu label="Apellido" placeholder="Apellido" type="text" name="apellido" value={formData.apellido} onChange={handleChange} />
            <Inpu label="Edad" placeholder="Edad" type="number" name="edad" value={String(formData.edad) ?? ''} onChange={handleChange} />
            <Inpu label="Telefono" placeholder="Telefono" type="number" name="telefono" value={String(formData.telefono) ?? ''} onChange={handleChange} />
            <Inpu label="Correo" placeholder="Correo" type="email" name="correo" value={formData.correo ?? ''} />
            <Inpu label="Cargo" placeholder="Cargo" type="text" name="cargo" value={formData.cargo ?? ''} onChange={handleChange} />

            <button type="submit" className="bg-blue-500 text-white p-2 rounded-md">
                Guardar Cambios
            </button>
        </Form>
    )

}


export default FormuUpdate;