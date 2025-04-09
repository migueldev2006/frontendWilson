import React, { useState, useEffect } from "react";
import { Form } from "@heroui/form";
import Inpu from "@/components/molecules/input";
import { Solicitud } from "@/types/Solicitud";
import { useSolicitud } from "@/hooks/Solicitudes/useSolicitud";

type Props = {
  solicitudes: Solicitud[];
  solicitudId: number;
  id: string;
  onclose: () => void;
};

export const FormUpdate = ({ solicitudes, solicitudId, id, onclose }: Props) => {
  const [formData, setFormData] = useState<Partial<Solicitud>>({
    id_solicitud: 0,
    descripcion: "",
    cantidad: 0,
    aceptada: true,
    pendiente: false,
    rechazada: false,
    fk_usuario: 0,
    fk_inventario: 0,
  });

  const { updateSolicitud, getSolicitudById } = useSolicitud();

  useEffect(() => {
    // se ejecuta cuando algo se cambie en un usuario, obtiene el id y modifica el FormData
    const foundSolicitud = getSolicitudById(solicitudId);

    if (foundSolicitud) {
      setFormData(foundSolicitud);
    }
  }, [solicitudes, solicitudId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //se ejecuta cuando el usuario cambia algo en un campo
    const { name, value, type, checked } = e.target;

    setFormData((prev: Partial<Solicitud>) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.id_solicitud) {
      return <p className="text-center text-gray-500">Usuario no encontrado</p>;
    }

    try {
      await updateSolicitud(formData.id_solicitud, formData);
      onclose();
    } catch (error) {
      console.log("Error al actualizar el usuario", error);
    }
  };

  return (
    <Form id={id} className="w-full space-y-4" onSubmit={handleSubmit}>
      <Inpu
        label="Descripcion"
        placeholder="Descripcion"
        type="text"
        name="descripcion"
        value={formData.descripcion}
        onChange={handleChange}
      />
      <Inpu
        label="Cantidad"
        placeholder="Cantidad"
        type="number"
        name="cantidad"
        value={String(formData.cantidad) ?? ""}
        onChange={handleChange}
      />

      <button type="submit" className="bg-blue-500 text-white p-2 rounded-md">
        Guardar Cambios
      </button>
    </Form>
  );
};