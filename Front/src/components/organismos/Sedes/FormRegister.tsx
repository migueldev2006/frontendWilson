import React from "react";
import { Form } from "@heroui/form"
import Inpu from "@/components/molecules/input";
import { Sede } from "@/types/sedes";
import { Select, SelectItem } from "@heroui/react";

type FormularioProps = {

    addData: (Sede: Sede) => Promise<void>;
    onClose: () => void;
    id: string
}

export default function Formulario({ addData, onClose, id }: FormularioProps) {


    const [formData, setFormData] = React.useState<Sede>({
        id_sede: 0,
        nombre: "",
        created_at:"",
        updated_at:"",
        estado: true,
        fk_centro: 0,
    });

    const onSubmit = async (e : React.FormEvent) => { //preguntar si esta bien no usar el e: React.FormEvent
        //y aqui el preventdefault
        e.preventDefault();
        try {
            console.log("Enviando formulario con datos:", formData);
            await addData(formData);
            console.log("sede guardada correctamente");
            setFormData({
                id_sede: 0,
                nombre: "",
                estado: true,
                created_at:"",
                updated_at:"",
                fk_centro: 0,
            });
            onClose();
        } catch (error) {
            console.error("Error al cargar la sede ", error);
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

           

            <Inpu label="centro" placeholder="centro" type="number" name="fk_centro" value={formData.fk_centro.toString()} onChange={(e) => setFormData({ ...formData, fk_centro: Number(e.target.value) })} />

        </Form>
    )
}