import React from "react";
import { Form } from "@heroui/form";
import Inpu from "@/components/molecules/input";
import { Select, SelectItem } from "@heroui/react";
import { Inventario } from "@/types/Inventario";

type FormularioProps = {
  addData: (inventario: Inventario) => Promise<void>;
  onClose: () => void;
  id: string;
};

export default function Formulario({ addData, onClose, id }: FormularioProps) {
  const [formData, setFormData] = React.useState<Inventario>({
    id_inventario: 0,
    stock: 0,
    estado: true,
    created_at:'',
    updated_at:'',
    fk_sitio: 0,
    fk_elemento: 0,
  });

  const onSubmit = async (e: React.FormEvent) => {
    //preguntar si esta bien no usar el e: React.FormEvent
    //y aqui el preventdefault
    e.preventDefault();
    try {
      console.log("Enviando formulario con datos:", formData);
      await addData(formData);
      console.log("Inventario guardado correctamente");
      setFormData({
        id_inventario: 0,
        stock: 0,
        estado: true,
        created_at:'',
        updated_at:'',
        fk_sitio: 0,
        fk_elemento: 0,
      });
      onClose();
    } catch (error) {
      console.error("Error al cargar el inventario", error);
    }
  };

  return (
    <Form id={id} onSubmit={onSubmit} className="w-full space-y-4">
      <Inpu
        label="Stock"
        placeholder="Stock"
        type="number"
        name="stock"
        onChange={(e) =>
          setFormData({ ...formData, stock: Number(e.target.value) })
        }
      />

      <Select
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
      </Select>

      <Inpu
        label="Sitio"
        placeholder="Sitio"
        type="number"
        name="fk_sitio"
        onChange={(e) =>
          setFormData({ ...formData, fk_sitio: Number(e.target.value) })
        }
      />
      <Inpu
        label="Elemento"
        placeholder="Elemento"
        type="number"
        name="fk_elemento"
        onChange={(e) =>
          setFormData({ ...formData, fk_elemento: Number(e.target.value) })
        }
      />
    </Form>
  );
}
