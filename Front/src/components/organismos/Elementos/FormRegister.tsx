import React from "react";
import { Form } from "@heroui/form";
import Inpu from "@/components/molecules/input";
import { Elemento } from "@/types/Elemento";
import { Select, SelectItem } from "@heroui/react";

type FormularioProps = {
  addData: (elemento: Elemento) => Promise<void>;
  onClose: () => void;
  id: string;
};

export default function Formulario({ addData, onClose, id }: FormularioProps) {
  const [formData, setFormData] = React.useState<Elemento>({
    id_elemento: 0,
    nombre: "",
    valor: 0,
    perecedero: true,
    no_perecedero: false,
    estado: true,
    imagen_elemento: "",
    created_at:'',
    updated_at:'',
    fk_unidad_medida: 0,
    fk_categoria: 0,
    fk_caracteristica: 0,
  });

  const onSubmit = async (e: React.FormEvent) => {
    //preguntar si esta bien no usar el e: React.FormEvent
    //y aqui el preventdefault
    e.preventDefault();
    try {
      console.log("Enviando formulario con datos:", formData);
      await addData(formData);
      console.log("Elemento guardado correctamente");
      setFormData({
        id_elemento: 0,
        nombre: "",
        valor: 0,
        perecedero: true,
        no_perecedero: false,
        estado: true,
        imagen_elemento: "",
        created_at:'',
        updated_at:'',
        fk_unidad_medida: 0,
        fk_categoria: 0,
        fk_caracteristica: 0,
      });
      onClose();
    } catch (error) {
      console.error("Error al cargar el elemento", error);
    }
  };

  return (
    <Form id={id} onSubmit={onSubmit} className="w-full space-y-4">
      <Inpu
        label="Nombre"
        placeholder="Nombre"
        type="text"
        name="nombre"
        value={formData.nombre}
        onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
      />
      <Inpu
        label="Valor"
        placeholder="Valor"
        type="number"
        name="valor"
        onChange={(e) =>
          setFormData({ ...formData, valor: Number(e.target.value) })
        }
      />

      <Select
        aria-labelledby="tipoElemento"
        labelPlacement="outside"
        name="tipoElementoo"
        placeholder="Tipo de Elemento"
        onChange={(e) => {
          const value = e.target.value;
          if (value === "perecedero") {
            setFormData({
              ...formData,
              perecedero: true,
              no_perecedero: false,
            });
          } else if (value === "no_perecedero") {
            setFormData({
              ...formData,
              perecedero: false,
              no_perecedero: true,
            });
          }
        }}
      >
        <SelectItem key="perecedero">Perecedero</SelectItem>
        <SelectItem key="no_perecedero">No Perecedero</SelectItem>
      </Select>

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
        label="Imagen"
        type="file"
        name="imagen_elemento"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
              const base64 = reader.result as string;
              setFormData({ ...formData, imagen_elemento: base64 });
            };
            reader.readAsDataURL(file);
          }
        }}
      />
      <Inpu
        label="Unidad Medida"
        placeholder="Unidad Medida"
        type="number"
        name="fk_unidad_medida"
        value={formData.fk_unidad_medida.toString()}
        onChange={(e) =>
          setFormData({ ...formData, fk_unidad_medida: Number(e.target.value) })
        }
      />
      <Inpu
        label="Categoria"
        placeholder="Categoria"
        type="number"
        name="fk_categoria"
        value={formData.fk_categoria.toString()}
        onChange={(e) =>
          setFormData({ ...formData, fk_categoria: Number(e.target.value) })
        }
      />

      <Inpu
        label="Caracteristica"
        placeholder="Caracteristica"
        type="number"
        name="fk_caracteristica"
        value={formData.fk_caracteristica.toString()}
        onChange={(e) =>
          setFormData({
            ...formData,
            fk_caracteristica: Number(e.target.value),
          })
        }
      />
    </Form>
  );
}
