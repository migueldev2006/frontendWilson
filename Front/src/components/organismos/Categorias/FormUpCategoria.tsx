import React, { useState, useEffect } from "react";
import { Categoria } from "@/types/Categorias";
import { Form } from "@heroui/form"
import Inpu from "@/components/molecules/input";
import { useCategoria } from "@/hooks/Categorias/useCategorias";



type Props = {
    categorias: Categoria[] ;
    categoriaId: number;
    id: string
    onclose: () => void;

}

const FormUpCentro = ({ categorias, categoriaId, id, onclose }: Props) => {
    const [formData, setFormData] = useState<Partial<Categoria>>({
        id_categoria: 0,
        nombre: "",
        estado: true
    });

    const {updateCategoria, getCategoriaById} = useCategoria()

    useEffect(() => { // se ejecuta cuando algo se cambie en un usuario, obtiene el id y modifica el FormData
        const foundCategoria = getCategoriaById(categoriaId);

        if (foundCategoria) {
            setFormData(foundCategoria);
        }

    }, [categorias, categoriaId]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => { //se ejecuta cuando el usuario cambia algo en un campo
        const { name, value, type, checked } = e.target;

        setFormData((prev : Partial<Categoria>) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };


    const handleSubmit = async (e : React.FormEvent) => {

        e.preventDefault();

        
        if (!formData.id_categoria) {
            return <p className="text-center text-gray-500">Categoria no encontrado</p>;
        }
        
        try {
            await updateCategoria(formData.id_categoria, formData);
            
            onclose();
        } catch (error) {
            console.log("Error al actualizar la categoria", error);
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


export default FormUpCentro;