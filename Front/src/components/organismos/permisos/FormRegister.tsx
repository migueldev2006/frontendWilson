import React from "react";
import { Form } from "@heroui/form";
import Inpu from "@/components/molecules/input";
import { Permisos } from "@/types/permisos";
// import { Select, SelectItem } from "@heroui/react";

type FormularioProps = {

    addData: (permiso: Permisos) => Promise<void>;
    onClose: () => void;
    id: string
}

export default function Formulario({ addData, onClose, id }: FormularioProps) {


    const [formData, setFormData] = React.useState<Permisos>({
        id_permiso: 0,
        permiso: ""
    });

    const onSubmit = async (e : React.FormEvent) => { //preguntar si esta bien no usar el e: React.FormEvent
        //y aqui el preventdefault
        e.preventDefault();
        try {
            console.log("Enviando formulario con datos:", formData);
            await addData(formData);
            console.log("permiso guardado correctamente");
            setFormData({
                id_permiso: 0,
                permiso: ""

            });
            onClose();
        } catch (error) {
            console.error("Error al cargar el permiso", error);
        }
    }

    return (
        <Form id={id} onSubmit={onSubmit} className="w-full space-y-4">
    
            <Inpu label="permiso" placeholder="permiso" type="text" name="permiso" value={formData.permiso} onChange={(e) => setFormData({ ...formData, permiso: e.target.value })} />
           
            {/* <Select
                aria-labelledby="estado"
                labelPlacement="outside"
                name="estado"
                placeholder="Estado"
                onChange={(e) => setFormData({ ...formData, estado: e.target.value === "true" })} // Convierte a booleano
            >
                <SelectItem key="true">Activo</SelectItem>
                <SelectItem key="false" >Inactivo</SelectItem>
            </Select> */}

            {/* <Inpu label="Estado" placeholder="Estado" type="checkbox" name="estado" value={formData.estado.toString()} onChange={(e) => setFormData({ ...formData, estado: e.target.checked })} /> */}

            

        </Form>
    )
}