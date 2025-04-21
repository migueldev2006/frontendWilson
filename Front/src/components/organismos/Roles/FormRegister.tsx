import React from "react";
import { Form } from "@heroui/form";
import Inpu from "@/components/molecules/input";
import { Select, SelectItem } from "@heroui/react";
import { Rol } from "@/types/Rol";

type FormularioProps = {
  addData: (rol: Rol) => Promise<void>;
  onClose: () => void;
  id: string;
};

export default function Formulario({ addData, onClose, id }: FormularioProps) {
  const [formData, setFormData] = React.useState<Rol>({
    id_rol: 0,
    nombre: "",
    estado: true,
    created_at: "",
    updated_at: "",
  });

  const onSubmit = async (e: React.FormEvent) => {
    //preguntar si esta bien no usar el e: React.FormEvent
    //y aqui el preventdefault
    //preguntar si esta bien no usar el e: React.FormEvent
    //y aqui el preventdefault
    e.preventDefault();
    try {
      console.log("Enviando formulario con datos:", formData);
      await addData(formData);
      console.log("Usuario guardado correctamente");
      setFormData({
        id_rol: 0,
        nombre: "",
        estado: true,
        created_at:'',
        updated_at:'',
      });
      onClose();
    } catch (error) {
      console.error("Error al cargar el usuario", error);
    }
  }

  return (
    <Form id={id} onSubmit={onSubmit} className="w-full space-y-4">
      <Inpu
        label="Nombre"
        placeholder="Nombre"
        type="text"
        name="nombre"
        value={formData.nombre}
        onChange={(e) => {
          setFormData({ ...formData, nombre: e.target.value });
        }}
      />

      <Select
        label="Estado"
        name="estado"
        placeholder="Estado"
        onChange={(e) =>
          setFormData({ ...formData, estado: e.target.value === "true" })
        }
      >
        <SelectItem key="true">Activo</SelectItem>
        <SelectItem key="false">Inactivo</SelectItem>
      </Select>
    </Form>
  );
}
