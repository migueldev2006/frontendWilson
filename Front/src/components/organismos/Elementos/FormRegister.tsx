import React from "react";
import { Form } from "@heroui/form";
import Inpu from "@/components/molecules/input";
import { Elemento } from "@/types/Elemento";
import { Select, SelectItem } from "@heroui/react";
import { useUnidad } from "@/hooks/UnidadesMedida/useUnidad";
import { useCategoria } from "@/hooks/Categorias/useCategorias";
import { useCaracteristica } from "@/hooks/Caracteristicas/useCaracteristicas";

type FormularioProps = {
  addData: (elemento: Elemento) => Promise<void>;
  onClose: () => void;
  id: string;
};

export default function Formulario({ addData, onClose, id }: FormularioProps) {
  const [formData, setFormData] = React.useState<Elemento>({
    id_elemento: 0,
    nombre: "",
    descripcion:"",
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
    tipo_elemento:""
  });

  const {
    unidades,
    isLoading: loadingUnidades,
    isError: errorUnidades,
  } = useUnidad();
  const {
    categorias,
    isLoading: loadingCategorias,
    isError: errorCategorias,
  } = useCategoria();
  const {
    caracteristicas,
    isLoading: loadingCaracteristicas,
    isError: errorCaracteristicas,
  } = useCaracteristica();

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
        descripcion:"",
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
        tipo_elemento:""
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
        label="Descripcion"
        placeholder="Descripcion"
        type="text"
        name="descripcion"
        value={formData.descripcion}
        onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
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

      <Inpu
        label="Imagen"
        type="file"
        name="imagen_elemento"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            setFormData({ ...formData, imagen_elemento: file });
          }
        }}
      />
      {!loadingUnidades && !errorUnidades && unidades && (
        <Select
          label="Unidad Medida"
          name="fk_unidad_medida"
          placeholder="Selecciona una unidad"
          onChange={(e) =>
            setFormData({
              ...formData,
              fk_unidad_medida: Number(e.target.value),
            })
          }
        >
          {unidades.map((unidad) => (
            <SelectItem key={unidad.id_unidad}>{unidad.nombre}</SelectItem>
          ))}
        </Select>
      )}
      {!loadingCategorias && !errorCategorias && categorias && (
        <Select
          label="Categoria"
          name="fk_categoria"
          placeholder="Selecciona una categoria"
          onChange={(e) =>
            setFormData({ ...formData, fk_categoria: Number(e.target.value) })
          }
        >
          {categorias.map((categoria) => (
            <SelectItem key={categoria.id_categoria}>
              {categoria.nombre}
            </SelectItem>
          ))}
        </Select>
      )}

      {!loadingCaracteristicas && !errorCaracteristicas && caracteristicas && (
        <Select
          label="Caracteristica"
          name="fk_caracteristica"
          placeholder="Selecciona una caracteristica"
          onChange={(e) =>
            setFormData({
              ...formData,
              fk_caracteristica: Number(e.target.value),
            })
          }
        >
          {caracteristicas.map((caracteristica) => (
            <SelectItem key={caracteristica.id_caracteristica}>
              {caracteristica.nombre}
            </SelectItem>
          ))}
        </Select>
      )}
    </Form>
  );
}
