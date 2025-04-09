import React, { useState, useEffect } from "react";
import { RolModulo } from "@/types/rolModulo";
import { Form } from "@heroui/form"
import Inpu from "@/components/molecules/input";
import {useRolModulo} from "@/hooks/rolModulo/useRolModulo";



type Props = {
    rolModulos: RolModulo[] ;
    rolModuloId: number;
    id: string
    onclose: () => void;

}

const FormuUpdate = ({ rolModulos, rolModuloId, id, onclose }: Props) => {
    const [formData, setFormData] = useState<Partial<RolModulo>>({
        id_rol_modulo: 0,
        fk_rol: 0,
        fk_modulo: 0,
        fk_permiso: 0,
    });

    const {updateRolModulo, getRolModuloById} = useRolModulo()

    useEffect(() => { // se ejecuta cuando algo se cambie en un usuario, obtiene el id y modifica el FormData
        const foundRolModulo = getRolModuloById(rolModuloId);

        if (foundRolModulo) {
            setFormData(foundRolModulo);
        }

    }, [rolModulos, rolModuloId]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => { //se ejecuta cuando el usuario cambia algo en un campo
        const { name, value, type, checked } = e.target;

        setFormData((prev : Partial<RolModulo>) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };


    const handleSubmit = async (e : React.FormEvent) => {

        e.preventDefault();
        if (!formData.id_rol_modulo) {
            return <p className="text-center text-gray-500">Usuario no encontrado</p>;
        }
        
        try {
            await updateRolModulo(formData.id_rol_modulo, formData);
            onclose();
        } catch (error) {
            console.log("Error al actualizar  RolModulo", error);
        }
    }




    return (
        <Form id={id} className="w-full space-y-4" onSubmit={handleSubmit}>
            <Inpu label="rol" placeholder="rol" type="number" name="fk_rol" value={String(formData.fk_rol) ?? ''} onChange={handleChange} />
            <Inpu label="modulo" placeholder="modulo" type="number" name="fk_modulo" value={String(formData.fk_modulo) ?? ''} onChange={handleChange} />
            <Inpu label="permiso" placeholder="permiso" type="number" name="fk_permiso" value={String(formData.fk_permiso) ?? ''} onChange={handleChange} />


            <button type="submit" className="bg-blue-500 text-white p-2 rounded-md">
                Guardar Cambios
            </button>
        </Form>
    )

}


export default FormuUpdate;