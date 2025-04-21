import React from "react";
import { Form } from "@heroui/form";
import Inpu from "@/components/molecules/input";
import { Movimiento } from "@/types/Movimiento";
import { useUsuario } from "@/hooks/Usuarios/useUsuario";
import { useTipoMovimiento } from "@/hooks/TiposMovimento/useTipoMovimiento";
import { useInventario } from "@/hooks/Inventarios/useInventario";
import { Select, SelectItem } from "@heroui/react";
import { useSitios } from "@/hooks/sitios/useSitios";
import { useElemento } from "@/hooks/Elementos/useElemento";

type FormularioProps = {
  addData: (movimiento: Movimiento) => Promise<void>;
  onClose: () => void;
  id: string;
};

export default function Formulario({ addData, onClose, id }: FormularioProps) {
  const [formData, setFormData] = React.useState<Movimiento>({
    id_movimiento: 0,
    descripcion: "",
    cantidad: 0,
    hora_ingreso: "",
    hora_salida: "",
    estado:true,
    aceptado: false,
    en_proceso: true,
    cancelado: false,
    devolutivo: true,
    no_devolutivo: false,
    created_at: "",
    updated_at: "",
    fk_usuario: 0,
    fk_tipo_movimiento: 0,
    fk_sitio: 0,
    fk_inventario: 0,
    tipo_movimiento: "",
  });

  const { users, isLoading: loadingUsers, isError: errorUsers } = useUsuario();
  const {
    tipos,
    isLoading: loadingTipos,
    isError: errorTipos,
  } = useTipoMovimiento();
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
      console.log("Usuario guardado correctamente");
      setFormData({
        id_movimiento: 0,
        descripcion: "",
        cantidad: 0,
        hora_ingreso: "",
        hora_salida: "",
        estado:true,
        aceptado: false,
        en_proceso: true,
        cancelado: false,
        devolutivo: true,
        no_devolutivo: false,
        created_at: "",
        updated_at: "",
        fk_usuario: 0,
        fk_tipo_movimiento: 0,
        fk_sitio: 0,
        fk_inventario: 0,
        tipo_movimiento: "",
      });
      onClose();
    } catch (error) {
      console.error("Error al cargar el usuario", error);
    }
  };
  const [sitioSeleccionado, setSitioSeleccionado] = React.useState<
    number | null
  >(null);

  console.log(inventarios);
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
      <Inpu
        label="Hora Ingreso"
        placeholder="Hora Ingreso"
        type="time"
        name="hora_ingreso"
        value={formData.hora_ingreso}
        onChange={(e) =>
          setFormData({ ...formData, hora_ingreso: e.target.value })
        }
      />
      <Inpu
        label="Hora Salida"
        placeholder="Hora Salida"
        type="time"
        name="hora_salida"
        value={formData.hora_salida}
        onChange={(e) =>
          setFormData({ ...formData, hora_salida: e.target.value })
        }
      />

      <Select
        label="Tipo de Movimiento"
        name="tipo_movimiento"
        placeholder="Selecciona un tipo"
        onChange={(e) => {
          const value = e.target.value;
          setFormData({
            ...formData,
            tipo_movimiento:
              value === "devolutivo" ? "Devolutivo" : "No Devolutivo",
            devolutivo: value === "devolutivo",
            no_devolutivo: value === "no_devolutivo",
          });
        }}
      >
        <SelectItem key="devolutivo">Devolutivo</SelectItem>
        <SelectItem key="no_devolutivo">No Devolutivo</SelectItem>
      </Select>

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

      {!loadingTipos && !errorTipos && tipos && (
        <Select
          label="Tipo Movimiento"
          name="fk_tipo_movimiento"
          placeholder="Selecciona un tipo"
          onChange={(e) =>
            setFormData({
              ...formData,
              fk_tipo_movimiento: Number(e.target.value),
            })
          }
        >
          {tipos.map((tipo) => (
            <SelectItem key={tipo.id_tipo}>{tipo.nombre}</SelectItem>
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
        sitioSeleccionado && ( // <- asegúrate de que hay un sitio seleccionado
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
