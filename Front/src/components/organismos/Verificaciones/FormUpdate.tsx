import React, { useState, useEffect } from "react";
import { Form } from "@heroui/form";
import Inpu from "@/components/molecules/input";
import { Verificacion } from "@/types/Verificacion";
import { useVerificacion } from "@/hooks/Verificaciones/useVerificacion";

type Props = {
  verificaciones: Verificacion[];
  verificacionId: number;
  id: string;
  onclose: () => void;
};

export const FormUpdate = ({
  verificaciones,
  verificacionId,
  id,
  onclose,
}: Props) => {
  const [formData, setFormData] = useState<Partial<Verificacion>>({
    id_verificacion: 0,
    persona_encargada: "",
    persona_asignada: "",
    hora_ingreso: "",
    hora_salida: "",
    observaciones: "",
  });

  const { updateVerificacion, getVerificacionById } = useVerificacion();

  useEffect(() => {
    // se ejecuta cuando algo se cambie en un usuario, obtiene el id y modifica el FormData
    const foundVerificacion = getVerificacionById(verificacionId);

    if (foundVerificacion) {
      setFormData(foundVerificacion);
    }
  }, [verificaciones, verificacionId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //se ejecuta cuando el usuario cambia algo en un campo
    const { name, value, type, checked } = e.target;

    setFormData((prev: Partial<Verificacion>) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.id_verificacion) {
      return (
        <p className="text-center text-gray-500">Verifiaccion no encontrada</p>
      );
    }

    try {
      await updateVerificacion(formData.id_verificacion, formData);
      onclose();
    } catch (error) {
      console.log("Error al actualizar la verifiacion", error);
    }
  };

  return (
    <Form id={id} className="w-full space-y-4" onSubmit={handleSubmit}>
      <Inpu
        label="Persona Encargada"
        placeholder="Persona Encargada"
        type="text"
        name="persona_encargada"
        value={formData.persona_encargada ?? ""}
        onChange={handleChange}
      />
      <Inpu
        label="Persona Asignada"
        placeholder="Persona Asignada"
        type="text"
        name="persona_asignada"
        value={formData.persona_asignada}
        onChange={handleChange}
      />
      <Inpu
        label="Hora Ingreso"
        placeholder="Hora Ingreso"
        type="time"
        name="hora_ingreso"
        value={String(formData.hora_ingreso) ?? ""}
        onChange={handleChange}
      />
      <Inpu
        label="Hora Salida"
        placeholder="Hora Salida"
        type="time"
        name="hora_salida"
        value={String(formData.hora_salida) ?? ""}
        onChange={handleChange}
      />
      <Inpu
        label="Observaciones"
        placeholder="Observaciones"
        type="text"
        name="observaciones"
        value={formData.observaciones ?? ""}
      />

      <div className="justify-center pl-10">
        <button
          type="submit"
          className="w-80 bg-blue-700 text-white p-2 rounded-xl "
        >
          Guardar Cambios
        </button>
      </div>
    </Form>
  );
};
