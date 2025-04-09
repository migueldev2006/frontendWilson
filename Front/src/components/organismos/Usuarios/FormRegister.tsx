import React from "react";
import { Form } from "@heroui/form"
import Inpu from "@/components/molecules/input";
import { User } from "@/types/Usuario";
import { Select, SelectItem } from "@heroui/react";

type FormularioProps = {

    addData: (user: User) => Promise<void>;
    onClose: () => void;
    id: string
}

export default function Formulario({ addData, onClose, id }: FormularioProps) {


    const [formData, setFormData] = React.useState<User>({
        id_usuario: 0,
        documento: 0,
        nombre: "",
        apellido: "",
        edad: 0,
        telefono: "",
        correo: "",
        estado: true,
        cargo: "",
        password: "",
        fk_rol: 0,
    });

    const onSubmit = async (e : React.FormEvent) => { //preguntar si esta bien no usar el e: React.FormEvent
        //y aqui el preventdefault
        e.preventDefault();
        try {
            console.log("Enviando formulario con datos:", formData);
            await addData(formData);
            console.log("Usuario guardado correctamente");
            setFormData({
                id_usuario: 0,
                documento: 0,
                nombre: "",
                apellido: "",
                edad: 0,
                telefono: "",
                correo: "",
                estado: true,
                cargo: "",
                password: "",
                fk_rol: 0,
            });
            onClose();
        } catch (error) {
            console.error("Error al cargar el usuario", error);
        }
    }

    return (
        <Form id={id} onSubmit={onSubmit} className="w-full space-y-4">
            <Inpu label="Documento" placeholder="Documento" type="text" name="documento" onChange={(e) => setFormData({ ...formData, documento: Number(e.target.value) })} />
            <Inpu label="Nombre" placeholder="Nombre" type="text" name="nombre" value={formData.nombre} onChange={(e) => setFormData({ ...formData, nombre: e.target.value })} />
            <Inpu label="Apellido" placeholder="Apellido" type="text" name="apellido" value={formData.apellido} onChange={(e) => setFormData({ ...formData, apellido: e.target.value })} />
            <Inpu label="Edad" placeholder="Edad" type="number" name="edad" onChange={(e) => setFormData({ ...formData, edad: Number(e.target.value) })} />
            <Inpu label="Telefono" placeholder="Telefono" type="number" name="telefono" value={formData.telefono} onChange={(e) => setFormData({ ...formData, telefono: e.target.value })} />
            <Inpu label="Correo" placeholder="Correo" type="email" name="correo" value={formData.correo} onChange={(e) => setFormData({ ...formData, correo: e.target.value })} />

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

            <Inpu label="Cargo" placeholder="Cargo" type="text" name="cargo" value={formData.cargo} onChange={(e) => setFormData({ ...formData, cargo: e.target.value })} />
            <Inpu label="Paasword" placeholder="Password" type="password" name="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />

            <Inpu label="Rol" placeholder="Rol" type="number" name="fk_rol" value={formData.fk_rol.toString()} onChange={(e) => setFormData({ ...formData, fk_rol: Number(e.target.value) })} />

        </Form>
    )
}