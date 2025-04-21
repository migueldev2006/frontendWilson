import React from "react";
import { Form } from "@heroui/form";
import Inpu from "@/components/molecules/input";
import { Select, SelectItem } from "@heroui/react";
import { Inventario } from "@/types/Inventario";
import { useSitios } from "@/hooks/sitios/useSitios";
import { useElemento } from "@/hooks/Elementos/useElemento";

type FormularioProps = {
  addData: (inventario: Inventario) => Promise<void>;
  onClose: () => void;
  id: string;
  idSitio:number
};

export default function Formulario({
  addData,
  onClose,
  id,
  idSitio,
}: FormularioProps) {
  const [formData, setFormData] = React.useState<Inventario>({
    id_inventario: 0,
    stock: 0,
    estado: true,
    created_at: "",
    updated_at: "",
    fk_sitio: idSitio ?? 0,
    fk_elemento: 0,
    imagen_elemento:""
  });

  const {
    sitios,
    isLoading: loadingSitios,
    isError: errorSitios,
  } = useSitios();
  const {
    elementos,
    isLoading: loadingElementos,
    isError: errorElementos,
  } = useElemento();

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
        created_at: "",
        updated_at: "",
        fk_sitio: 0,
        fk_elemento: 0,
        imagen_elemento:""
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
        label="Estado"
        name="estado"
        placeholder="Estado"
        onChange={(e) =>
          setFormData({ ...formData, estado: e.target.value === "true" })
        } // Convierte a booleano
      >
        <SelectItem key="true">Activo</SelectItem>
        <SelectItem key="false">Inactivo</SelectItem>
      </Select>

      {!loadingSitios && !errorSitios && sitios && (
        <Select
          label="Sitio"
          name="fk_sitio"
          placeholder="Selecciona un sitio"
          selectedKeys={formData.fk_sitio.toString()}
          onChange={(e) =>
            setFormData({ ...formData, fk_sitio: Number(e.target.value) })
          }
          isDisabled={!!idSitio}
        >
          {sitios.map((sitio) => (
            <SelectItem key={sitio.id_sitio}>{sitio.nombre}</SelectItem>
          ))}
        </Select>
      )}

      {!loadingElementos && !errorElementos && elementos && (
        <Select
          label="Elemento"
          name="fk_elemento"
          placeholder="Selecciona un elemento"
          onChange={(e) =>
            setFormData({ ...formData, fk_elemento: Number(e.target.value) })
          }
        >
          {elementos.map((elemento) => (
            <SelectItem key={elemento.id_elemento}>
              {elemento.nombre}
            </SelectItem>
          ))}
        </Select>
      )}
    </Form>
  );
}
