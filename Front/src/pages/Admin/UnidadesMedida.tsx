import Globaltable from "@/components/organismos/table.tsx"; // Importar la tabla reutilizable
import { TableColumn } from "@/components/organismos/table.tsx";
import Buton from "@/components/molecules/Buton";
import Modall from "@/components/molecules/modal";
import { useState } from "react";
import { Chip } from "@heroui/chip";
import { useUnidad } from "@/hooks/UnidadesMedida/useUnidad";
import { Unidad } from "@/types/Unidad";
import Formulario from "@/components/organismos/UnidadesMedida/FormRegister";
import { FormUpdate } from "@/components/organismos/UnidadesMedida/FormUpdate";

export const UnidadTable = () => {
  const { unidades, isLoading, isError, error, addUnidad, changeState } =
    useUnidad();

  //Modal agregar
  const [isOpen, setIsOpen] = useState(false);
  const handleClose = () => setIsOpen(false);

  //Modal actualizar
  const [IsOpenUpdate, setIsOpenUpdate] = useState(false);
  const [selectedUnidad, setSelectedUnidad] = useState<Unidad | null>(null);

  const handleCloseUpdate = () => {
    setIsOpenUpdate(false);
    setSelectedUnidad(null);
  };

  const handleState = async (unidad: Unidad) => {
    await changeState(unidad.id_unidad);
  };

  const handleAddUnidad = async (unidad: Unidad) => {
    try {
      await addUnidad(unidad);
      handleClose(); // Cerrar el modal después de darle agregar usuario
    } catch (error) {
      console.error("Error al agregar la unidad:", error);
    }
  };

  const handleEdit = (unidad: Unidad) => {
    setSelectedUnidad(unidad);
    setIsOpenUpdate(true);
  };

  // Definir las columnas de la tabla
  const columns: TableColumn<Unidad>[] = [
    { key: "nombre", label: "Nombre" },
    { key: "created_at", label: "Fecha Creacion" },
    { key: "updated_at", label: "Fecha Actualizacion" },
    {
      key: "estado",
      label: "Estado",
      render: (unidad: Unidad) => (
        <Chip
          className={`px-2 py-1 rounded ${
            unidad.estado ? "text-green-500" : " text-red-500" //color texto
          }`}
          color={`${unidad.estado ? "success" : "danger"}`} //color de fondo
          variant="flat"
        >
          {unidad.estado ? "Activo" : "Inactivo"}
        </Chip>
      ),
    },
  ];

  if (isLoading) {
    return <span>Cargando datos...</span>;
  }

  if (isError) {
    return <span>Error: {error?.message}</span>;
  }

  const UnidadsWithKey = unidades
    ?.filter((unidad) => unidad?.id_unidad !== undefined)
    .map((unidad) => ({
      ...unidad,
      key: unidad.id_unidad ? unidad.id_unidad.toString() : crypto.randomUUID(),
      estado: Boolean(unidad.estado),
    }));

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">
        Unidades Registradas
      </h1>

      <Buton
        text="Nueva unidad"
        onPress={() => setIsOpen(true)}
        type="button"
        variant="solid"
        className="text-white bg-blue-700"
      />

      <Modall
        ModalTitle="Registrar Nueva Unidad"
        isOpen={isOpen}
        onOpenChange={handleClose}
      >
        <Formulario
          id="unidad-form"
          addData={handleAddUnidad}
          onClose={handleClose}
        />
        <button
          type="submit"
          form="unidad-form"
          className="bg-blue-700 text-white p-2 rounded-md"
        >
          Guardar
        </button>
      </Modall>

      <Modall
        ModalTitle="Editar Unidad"
        isOpen={IsOpenUpdate}
        onOpenChange={handleCloseUpdate}
      >
        {selectedUnidad && (
          <FormUpdate
            unidades={UnidadsWithKey ?? []}
            unidadId={selectedUnidad.id_unidad}
            id="FormUpdate"
            onclose={handleCloseUpdate}
          />
        )}
      </Modall>

      {UnidadsWithKey && (
        <Globaltable
          data={UnidadsWithKey}
          columns={columns}
          onEdit={handleEdit}
          onDelete={handleState}
        />
      )}
    </div>
  );
};
