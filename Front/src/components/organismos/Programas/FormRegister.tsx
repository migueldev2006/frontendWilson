import React from "react";
import { Form } from "@heroui/form"
import Inpu from "@/components/molecules/input";
import { Pformacion } from "@/types/programaFormacion";
import { Select, SelectItem } from "@heroui/react";

type FormularioProps = {

    addData: (Programa: Pformacion) => Promise<void>;
    onClose: () => void;
    id: string
}

export default function Formulario({ addData, onClose, id }: FormularioProps) {


    const [formData, setFormData] = React.useState<Pformacion>({
        id_programa: 0,
        nombre: "",
        estado: true,
        fk_area: 0,
    });

    const onSubmit = async (e : React.FormEvent) => { //preguntar si esta bien no usar el e: React.FormEvent
        //y aqui el preventdefault
        e.preventDefault();
        try {
            console.log("Enviando formulario con datos:", formData);
            await addData(formData);
            console.log("ficha guardada correctamente");
            setFormData({
                id_programa: 0,
                nombre: "",
                estado: true,
                fk_area: 0,
            });
            onClose();
        } catch (error) {
            console.error("Error al cargar el programa", error);
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
                onChange={(e) => setFormData({ ...formData, estado: e.target.value === "true" })} // Convierte a booleano
            >
                <SelectItem key="true">Activo</SelectItem>
                <SelectItem key="false" >Inactivo</SelectItem>
            </Select>

            {/* <Inpu label="Estado" placeholder="Estado" type="checkbox" name="estado" value={formData.estado.toString()} onChange={(e) => setFormData({ ...formData, estado: e.target.checked })} /> */}

           
           

            <Inpu label="area" placeholder="area" type="number" name="fk_area" value={formData.fk_area.toString()} onChange={(e) => setFormData({ ...formData, fk_area: Number(e.target.value) })} />

        </Form>
    )
}