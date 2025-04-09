import React from "react";
import { Form } from "@heroui/form"
import Inpu from "@/components/molecules/input";
import { RolModulo } from "@/types/rolModulo";
// import { Select, SelectItem } from "@heroui/react";

type FormularioProps = {

    addData: (rolModulo: RolModulo) => Promise<void>;
    onClose: () => void;
    id: string
}

export default function Formulario({ addData, onClose, id }: FormularioProps) {


    const [formData, setFormData] = React.useState<RolModulo>({
        id_rol_modulo: 0,
        fk_rol: 0,
        fk_modulo: 0,
        fk_permiso: 0,
    });

    const onSubmit = async (e : React.FormEvent) => { //preguntar si esta bien no usar el e: React.FormEvent
        //y aqui el preventdefault
        e.preventDefault();
        try {
            console.log("Enviando formulario con datos:", formData);
            await addData(formData);
            console.log("Usuario guardado correctamente");
            setFormData({
                id_rol_modulo: 0,
                fk_rol: 0,
                fk_modulo: 0,
                fk_permiso: 0,
            });
            onClose();
        } catch (error) {
            console.error("Error al cargar el usuario", error);
        }
    }

    return (
        <Form id={id} onSubmit={onSubmit} className="w-full space-y-4">
            <Inpu label="Rol" placeholder="Rol" type="number" name="fk_rol" value={formData.fk_rol.toString()} onChange={(e) => setFormData({ ...formData, fk_rol: Number(e.target.value) })} />
            <Inpu label="Modulo" placeholder="Modulo" type="number" name="fk_modulo" value={formData.fk_modulo.toString()} onChange={(e) => setFormData({ ...formData, fk_modulo: Number(e.target.value) })} />
            <Inpu label="Permiso" placeholder="Permiso" type="number" name="fk_permiso" value={formData.fk_permiso.toString()} onChange={(e) => setFormData({ ...formData, fk_permiso: Number(e.target.value) })} />

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