import Globaltable from "@/components/organismos/table.tsx"; // Importar la tabla reutilizable
import { TableColumn } from "@/components/organismos/table.tsx";
import Buton from "@/components/molecules/Buton";
import Modall from "@/components/molecules/modal";
import { useState } from "react";
import { FormUpdate } from "@/components/organismos/Solicitudes/FormUpdate";
import Formulario from "@/components/organismos/Solicitudes/FormRegister";
import { useSolicitud } from "@/hooks/Solicitudes/useSolicitud";
import { Solicitud } from "@/types/Solicitud";

export const SolicitudTable = () => {
  const { solicitudes, isLoading, isError, error, addSolicitud } =
    useSolicitud();

  //Modal agregar
  const [isOpen, setIsOpen] = useState(false);
  const handleClose = () => setIsOpen(false);

  //Modal actualizar
  const [IsOpenUpdate, setIsOpenUpdate] = useState(false);
  const [selectedSolicitud, setSelectedSolicitud] = useState<Solicitud | null>(
    null
  );

  const handleCloseUpdate = () => {
    setIsOpenUpdate(false);
    setSelectedSolicitud(null);
  };

  const handleAddSolicitud = async (solicitud: Solicitud) => {
    try {
      await addSolicitud(solicitud);
      handleClose(); // Cerrar el modal después de darle agregar usuario
    } catch (error) {
      console.error("Error al agregar la solicitud:", error);
    }
  };

  const handleEdit = (solicitud: Solicitud) => {
    setSelectedSolicitud(solicitud);
    setIsOpenUpdate(true);
  };

  // Definir las columnas de la tabla
  const columns: TableColumn<Solicitud>[] = [
    { key: "descripcion", label: "Nombre" },
    { key: "cantidad", label: "Valor" },
  ];

  if (isLoading) {
    return <span>Cargando datos...</span>;
  }

  if (isError) {
    return <span>Error: {error?.message}</span>;
  }

  const SolicitudsWithKey = solicitudes
    ?.filter((solicitud) => solicitud?.id_solicitud !== undefined)
    .map((solicitud) => ({
      ...solicitud,
      key: solicitud.id_solicitud
        ? solicitud.id_solicitud.toString()
        : crypto.randomUUID(),
    }));

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">
        Solicituds Registrados
      </h1>

      <Buton
        text="Nuevo solicitud"
        onPress={() => setIsOpen(true)}
        type="button"
        color="primary"
        variant="solid"
        className="mb-8"
      />

      <Modall
        ModalTitle="Registrar Nuevo Solicitud"
        isOpen={isOpen}
        onOpenChange={handleClose}
      >
        <Formulario
          id="element-form"
          addData={handleAddSolicitud}
          onClose={handleClose}
        />
        <button
          type="submit"
          form="user-form"
          className="bg-blue-500 text-white p-2 rounded-md"
        >
          Guardar
        </button>
      </Modall>

      <Modall
        ModalTitle="Editar Usuario"
        isOpen={IsOpenUpdate}
        onOpenChange={handleCloseUpdate}
      >
        {selectedSolicitud && (
          <FormUpdate
            solicitudes={SolicitudsWithKey ?? []}
            solicitudId={selectedSolicitud.id_solicitud}
            id="FormUpdate"
            onclose={handleCloseUpdate}
          />
        )}
      </Modall>

      {SolicitudsWithKey && (
        <Globaltable
          data={SolicitudsWithKey}
          columns={columns}
          onEdit={handleEdit}
          onDelete={() => {}}
        />
      )}
    </div>
  );
};
