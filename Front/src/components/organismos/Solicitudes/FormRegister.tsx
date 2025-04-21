import React from "react";
import { Form } from "@heroui/form";
import Inpu from "@/components/molecules/input";
// import { Select, SelectItem } from "@heroui/react";
import { Solicitud } from "@/types/Solicitud";
import { useUsuario } from "@/hooks/Usuarios/useUsuario";
import { Select, SelectItem } from "@heroui/react";
import { useSitios } from "@/hooks/sitios/useSitios";
import { useInventario } from "@/hooks/Inventarios/useInventario";
import { useElemento } from "@/hooks/Elementos/useElemento";

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
    estado: true,
    aceptada: false,
    pendiente: true,
    rechazada: false,
    created_at: "",
    updated_at: "",
    fk_sitio: 0,
    fk_usuario: 0,
    fk_inventario: 0,
  });

  const { users, isLoading: loadingUsers, isError: errorUsers } = useUsuario();
  const {
    sitios,
    isLoading: loadingSitios,
    isError: errorSitios,
  } = useSitios();
  const {
    inventarios,
    isLoading: loadingInventarios,
    isError: errorInventarios,
  } = useInventario();
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
      console.log("Solicitud guardado correctamente");
      setFormData({
        id_solicitud: 0,
        descripcion: "",
        cantidad: 0,
        estado: true,
        aceptada: false,
        pendiente: true,
        rechazada: false,
        created_at: "",
        updated_at: "",
        fk_sitio: 0,
        fk_usuario: 0,
        fk_inventario: 0,
      });
      onClose();
    } catch (error) {
      console.error("Error al cargar la solicitud", error);
    }
  };
  const [sitioSeleccionado, setSitioSeleccionado] = React.useState<
    number | null
  >(null);

  return (
    <Form id={id} onSubmit={onSubmit} className="w-full space-y-4">
      <Inpu
        label="Descripcion"
        placeholder="Descripcion"
        type="text"
        name="descripcion"
        value={formData.descripcion}
        onChange={(e) =>
          setFormData({ ...formData, descripcion: e.target.value })
        }
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

      {!loadingUsers && !errorUsers && users && (
        <Select
          label="Usuario"
          name="fk_usuario"
          placeholder="Selecciona un Usuario"
          onChange={(e) =>
            setFormData({ ...formData, fk_usuario: Number(e.target.value) })
          }
        >
          {users.map((usuario) => (
            <SelectItem key={usuario.id_usuario}>{usuario.nombre}</SelectItem>
          ))}
        </Select>
      )}

      {!loadingSitios && !errorSitios && sitios && (
        <Select
          label="Sitio"
          name="fk_sitio"
          placeholder="Selecciona un sitio"
          onChange={(e) => {
            const sitioId = Number(e.target.value);
            setFormData({ ...formData, fk_sitio: sitioId });
            setSitioSeleccionado(sitioId);
            setFormData((prev) => ({ ...prev, fk_inventario: 0 })); // opcional: limpiar inventario seleccionado
          }}
        >
          {sitios.map((sitio) => (
            <SelectItem key={sitio.id_sitio}>{sitio.nombre}</SelectItem>
          ))}
        </Select>
      )}

      {!loadingInventarios &&
        !errorInventarios &&
        inventarios &&
        !loadingElementos &&
        !errorElementos &&
        elementos &&
        sitioSeleccionado && (
          <Select
            label="Elemento del Inventario"
            name="fk_inventario"
            placeholder="Selecciona un elemento del inventario"
            value={formData.fk_inventario}
            onChange={(e) =>
              setFormData({
                ...formData,
                fk_inventario: Number(e.target.value),
              })
            }
          >
            {inventarios
              .filter((inv) => inv.fk_sitio === sitioSeleccionado) // <- filtrado clave
              .map((inventario) => {
                const elemento = elementos.find(
                  (e) => e.id_elemento === inventario.fk_elemento
                );
                return (
                  <SelectItem key={inventario.id_inventario}>
                    {elemento ? elemento.nombre : "Elemento no disponible"}
                  </SelectItem>
                );
              })}
          </Select>
        )}
    </Form>
  );
}
