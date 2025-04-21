import React, { useState, useEffect } from "react";
import { Form } from "@heroui/form";
import Inpu from "@/components/molecules/input";
import { Elemento } from "@/types/Elemento";
import { useElemento } from "@/hooks/Elementos/useElemento";

type Props = {
  elementos: Elemento[];
  elementoId: number;
  id: string;
  onclose: () => void;
};

export const FormUpdate = ({ elementos, elementoId, id, onclose }: Props) => {
  const [formData, setFormData] = useState<Partial<Elemento>>({
    id_elemento: 0,
    nombre: "",
    valor: 0,
    perecedero: true,
    no_perecedero: false,
    estado: true,
    imagen_elemento: "",
    fk_unidad_medida: 0,
    fk_categoria: 0,
    fk_caracteristica: 0,
  });

  const { updateElemento, getElementoById } = useElemento();

  useEffect(() => {
    // se ejecuta cuando algo se cambie en un usuario, obtiene el id y modifica el FormData
    const foundElemento = getElementoById(elementoId);

    if (foundElemento) {
      setFormData(foundElemento);
    }
  }, [elementos, elementoId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //se ejecuta cuando el usuario cambia algo en un campo
    const { name, value, type, checked } = e.target;

    setFormData((prev: Partial<Elemento>) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.id_elemento) {
      return (
        <p className="text-center text-gray-500">Elemento no encontrado</p>
      );
    }

    try {
      const updatedData: Partial<Elemento> = {
        ...formData,
      };

      if (formData.imagen_elemento instanceof File) {
        updatedData.imagen_elemento = formData.imagen_elemento;
      }
      await updateElemento(formData.id_elemento, formData);
      onclose();
    } catch (error) {
      console.log("Error al actualizar el Elemento", error);
    }
  };

  return (
    <Form id={id} className="w-full space-y-4" onSubmit={handleSubmit}>
      <Inpu
        label="Nombre"
        placeholder="Nombre"
        type="text"
        name="nombre"
        value={formData.nombre ?? ""}
        onChange={handleChange}
      />
      <Inpu
        label="Descripcion"
        placeholder="Descripcion"
        type="text"
        name="descripcion"
        value={formData.descripcion ?? ""}
        onChange={handleChange}
      />
      <Inpu
        label="Valor"
        placeholder="Valor"
        type="number"
        name="valor"
        value={String(formData.valor) ?? ""}
        onChange={handleChange}
      />
      {formData.imagen_elemento &&
        typeof formData.imagen_elemento === "string" && (
          <div className="flex justify-center">
            <img
              src={`http://localhost:3000/img/${formData.imagen_elemento}`}
              alt="Imagen actual"
              className="w-40 h-40 object-cover rounded-lg mb-4"
            />
          </div>
        )}
      {formData.imagen_elemento instanceof File && (
        <div className="flex justify-center">
          <img
            src={URL.createObjectURL(formData.imagen_elemento)}
            alt="Nueva imagen"
            className="w-40 h-40 object-cover rounded-lg mb-4"
          />
        </div>
      )}

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
      <div className="justify-center pl-10">
        <button
          type="submit"
          className="w-80 bg-blue-700 text-white p-2 rounded-xl"
        >
          Guardar Cambios
        </button>
      </div>
    </Form>
  );
};
