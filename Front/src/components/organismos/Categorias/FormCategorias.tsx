import React from "react";
import { Form } from "@heroui/form"
import Inpu from "@/components/molecules/input";
import { Categoria } from "@/types/Categorias";
import { Select, SelectItem } from "@heroui/react";

type FormularioProps = {

    addData: (categorias: Categoria) => Promise<void>;
    onClose: () => void;
    id: string
}

export default function FormCategorias({ addData, onClose, id }: FormularioProps) {


    const [formData, setFormData] = React.useState<Categoria>({
        id_categoria: 0,
        nombre: "",
        estado: true
    });

    const onSubmit = async (e : React.FormEvent) => { //preguntar si esta bien no usar el e: React.FormEvent
        //y aqui el preventdefault
        e.preventDefault();
        try {
            await addData(formData);
            setFormData({
                id_categoria: 0,
                nombre: "",
                estado: true
            });
            onClose();
        } catch (error) {
            console.error("Error al cargar la categoria", error);
        }
    }

    return (
        <Form id={id} onSubmit={onSubmit} className="w-full space-y-4">
            
            <Inpu label="Nombre" placeholder="Nombre" type="text" name="nombre" value={formData.nombre} onChange={(e) => setFormData({ ...formData, nombre: e.target.value })} />

            <Select
                aria-labelledby="estado"
                labelPlacement="outside"
                name="estado"
                placeholder="Estado"
                onChange={(e) => setFormData({ ...formData, estado: e.target.value === "true" })} 
            >
                <SelectItem key="true">Activo</SelectItem>
                <SelectItem key="false" >Inactivo</SelectItem>
            </Select>

        </Form>
    )
}