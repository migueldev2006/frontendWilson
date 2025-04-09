import React from "react";
import { Form } from "@heroui/form"
import Inpu from "@/components/molecules/input";
import { Ficha } from "@/types/Ficha";
import { Select, SelectItem } from "@heroui/react";

type FormularioProps = {

    addData: (ficha: Ficha) => Promise<void>;
    onClose: () => void;
    id: string
}

export default function Formulario({ addData, onClose, id }: FormularioProps) {


    const [formData, setFormData] = React.useState<Ficha>({
        id_ficha: 0,
        codigo_ficha: 0,
        estado: true,
        fk_programa: 0,
    });

    const onSubmit = async (e : React.FormEvent) => { //preguntar si esta bien no usar el e: React.FormEvent
        //y aqui el preventdefault
        e.preventDefault();
        try {
            console.log("Enviando formulario con datos:", formData);
            await addData(formData);
            console.log("ficha guardada correctamente");
            setFormData({
                id_ficha: 0,
                codigo_ficha: 0,
                estado: true,
                fk_programa: 0,
            });
            onClose();
        } catch (error) {
            console.error("Error al cargar el fichas", error);
        }
    }

    return (
        <Form id={id} onSubmit={onSubmit} className="w-full space-y-4">
            <Inpu label="codigo_ficha" placeholder="codigo_ficha" type="text" name="codigo_ficha" onChange={(e) => setFormData({ ...formData, codigo_ficha: Number(e.target.value) })} />
            
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

           
           

            <Inpu label="programa" placeholder="programa" type="number" name="fk_programa" value={formData.fk_programa.toString()} onChange={(e) => setFormData({ ...formData, fk_programa: Number(e.target.value) })} />

        </Form>
    )
}