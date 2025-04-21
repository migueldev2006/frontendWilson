import React from "react";
import { Form } from "@heroui/form"
import Inpu from "@/components/molecules/input";
import { Municipio } from "@/types/Municipio";
import { Select, SelectItem } from "@heroui/react";

type FormularioProps = {

    addData: (municipios: Municipio) => Promise<void>;
    onClose: () => void;
    id: string
}

export default function FormMunicipios({ addData, onClose, id }: FormularioProps) {


    const [formData, setFormData] = React.useState<Municipio>({
        id_municipio: 0,
        nombre: "",
        departamento: "",
        estado: true
    });

    const onSubmit = async (e: React.FormEvent) => { 
        
        e.preventDefault();
        try {
            await addData(formData);
            setFormData({
                id_municipio: 0,
                nombre: "",
                departamento: "",
                estado: true
            });
            onClose();
        } catch (error) {
            console.error("Error al cargar el municipio", error);
        }
    }

    return (
        <Form id={id} onSubmit={onSubmit} className="w-full space-y-4">

            <Inpu label="Nombre" placeholder="Nombre" type="text" name="nombre" value={formData.nombre} onChange={(e) => setFormData({ ...formData, nombre: e.target.value })} />
            <Inpu label="Departamento" placeholder="Departamento" type="text" name="departaento" value={formData.departamento} onChange={(e) => setFormData({ ...formData, departamento: e.target.value })} />

            <Select
                aria-labelledby="estado"
                labelPlacement="outside"
                name="estado"
                placeholder="Estado"
                onChange={(e) => setFormData({ ...formData, estado: e.target.value === "true" })} // Convierte a booleano
            >
                <SelectItem key="true">Activo</SelectItem>
                <SelectItem key="false" >Inactivo</SelectItem>
            </Select>

            
        </Form>
    )
}