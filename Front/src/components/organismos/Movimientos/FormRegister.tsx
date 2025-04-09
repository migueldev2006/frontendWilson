import React from "react";
import { Form } from "@heroui/form";
import Inpu from "@/components/molecules/input";
import { Movimiento } from "@/types/Movimiento";
// import { Select, SelectItem } from "@heroui/react";

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
    aceptado: true,
    en_proceso: false,
    cancelado: false,
    devolutivo: true,
    no_devolutivo: false,
    created_at: "",
    updated_at: "",
    fk_usuario: 0,
    fk_tipo_movimiento: 0,
    fk_sitio: 0,
    fk_inventario: 0,
  });

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
        aceptado: false,
        en_proceso: true,
        cancelado: false,
        devolutivo: true,
        no_devolutivo: false,
        created_at:'',
        updated_at:'',
        fk_usuario: 0,
        fk_tipo_movimiento: 0,
        fk_sitio: 0,
        fk_inventario: 0,
      });
      onClose();
    } catch (error) {
      console.error("Error al cargar el usuario", error);
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
      </Select>

      <Inpu label="Estado" placeholder="Estado" type="checkbox" name="estado" value={formData.estado.toString()} onChange={(e) => setFormData({ ...formData, estado: e.target.checked })} /> */}

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
        label="Tipo Movimiento"
        placeholder="Tipo Movimiento"
        type="number"
        name="fk_tipo_movimiento"
        value={formData.fk_tipo_movimiento.toString()}
        onChange={(e) =>
          setFormData({
            ...formData,
            fk_tipo_movimiento: Number(e.target.value),
          })
        }
      />
      <Inpu
        label="Sitio"
        placeholder="Sitio"
        type="number"
        name="fk_sitio"
        value={formData.fk_sitio.toString()}
        onChange={(e) =>
          setFormData({ ...formData, fk_sitio: Number(e.target.value) })
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
