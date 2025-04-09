import React from "react";
import { Form } from "@heroui/form";
import Inpu from "@/components/molecules/input";
// import { Select, SelectItem } from "@heroui/react";
import { Solicitud } from "@/types/Solicitud";

type FormularioProps = {
  addData: (solicitud: Solicitud) => Promise<void>;
  onClose: () => void;
  id: string;
};

export default function Formulario({ addData, onClose, id }: FormularioProps) {
  const [formData, setFormData] = React.useState<Solicitud>({
    id_solicitud: 0,
    descripcion: "",
    cantidad: 0,
    aceptada: true,
    pendiente: false,
    rechazada: false,
    created_at:'',
    updated_at:'',
    fk_usuario: 0,
    fk_inventario: 0,
  });

  const onSubmit = async (e: React.FormEvent) => {
    //preguntar si esta bien no usar el e: React.FormEvent
    //y aqui el preventdefault
    e.preventDefault();
    try {
      console.log("Enviando formulario con datos:", formData);
      await addData(formData);
      console.log("Solicitud guardado correctamente");
      setFormData({
        id_solicitud: 0,
        descripcion: "",
        cantidad: 0,
        aceptada: true,
        pendiente: false,
        rechazada: false,
        created_at:'',
        updated_at:'',
        fk_usuario: 0,
        fk_inventario: 0,
      });
      onClose();
    } catch (error) {
      console.error("Error al cargar la solicitud", error);
    }
  };

  return (
    <Form id={id} onSubmit={onSubmit} className="w-full space-y-4">
      <Inpu
        label="Descripcion"
        placeholder="Descripcion"
        type="text"
        name="descripcion"
        value={formData.descripcion}
        onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
      />
      <Inpu
        label="Cantidad"
        placeholder="Cantidad"
        type="number"
        name="cantidad"
        onChange={(e) =>
          setFormData({ ...formData, cantidad: Number(e.target.value) })
        }
      />

      {/* <Select
        aria-labelledby="estado"
        labelPlacement="outside"
        name="estado"
        placeholder="Estado"
        onChange={(e) =>
          setFormData({ ...formData, estado: e.target.value === "true" })
        } // Convierte a booleano
      >
        <SelectItem key="true">Activo</SelectItem>
        <SelectItem key="false">Inactivo</SelectItem>
      </Select> */}

      <Inpu
        label="Usuario"
        placeholder="Usuario"
        type="number"
        name="fk_usuario"
        value={formData.fk_usuario.toString()}
        onChange={(e) =>
          setFormData({ ...formData, fk_usuario: Number(e.target.value) })
        }
      />
      <Inpu
        label="Inventario"
        placeholder="Inventario"
        type="number"
        name="fk_inventario"
        value={formData.fk_inventario.toString()}
        onChange={(e) =>
          setFormData({ ...formData, fk_inventario: Number(e.target.value) })
        }
      />
    </Form>
  );
}
