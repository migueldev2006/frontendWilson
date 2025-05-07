import Globaltable from "@/components/organismos/table.tsx"; // Importar la tabla reutilizable
import { TableColumn } from "@/components/organismos/table.tsx";
import Buton from "@/components/molecules/Buton";
import Modall from "@/components/molecules/modal";
import Formulario from "@/components/organismos/Sitios/FormRegister";
import { useState } from "react";
import { FormUpdate } from "@/components/organismos/Sitios/Formupdate";
import { useSitios } from "@/hooks/sitios/useSitios";
import { Sitios } from "@/types/sitios";
import { Card, CardBody } from "@heroui/react";

const SitiosTable = () => {
  const { sitios, isLoading, isError, error, addSitio, changeState } =
    useSitios();

  //Modal agregar
  const [isOpen, setIsOpen] = useState(false);
  const handleClose = () => setIsOpen(false);

  //Modal actualizar
  const [IsOpenUpdate, setIsOpenUpdate] = useState(false);
  const [selectedSitio, setSelectedSitio] = useState<Sitios | null>(null);


  const handleCloseUpdate = () => {
    setIsOpenUpdate(false);
    setSelectedSitio(null);
  };

  const handleState = async (id_sitio: number) => {
    await changeState(id_sitio);
  };

  const handleAddSitio = async (sitio: Sitios) => {
    try {
      await addSitio(sitio);
      handleClose(); // Cerrar el modal después de darle agregar usuario
    } catch (error) {
      console.error("Error al agregar el sitio:", error);
    }
  };

  const handleEdit = (sitio: Sitios) => {
    setSelectedSitio(sitio);
    setIsOpenUpdate(true);
  };

  // Definir las columnas de la tabla
  const columns: TableColumn<Sitios>[] = [
    { key: "nombre", label: "Nombre" },
    { key: "persona_encargada", label: "persona_encargada" },
    { key: "ubicacion", label: "ubicacion" },
    {
      key: "created_at",
      label: "Fecha CReacion",
      render: (sitio: Sitios) => (
        <span>
          {sitio.created_at
            ? new Date(sitio.created_at).toLocaleDateString("es-ES", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
              })
            : "N/A"}
        </span>
      ),
    },
    {
      key: "updated_at",
      label: "Fecha Actualización",
      render: (sitio: Sitios) => (
        <span>
          {sitio.updated_at
            ? new Date(sitio.updated_at).toLocaleDateString("es-ES", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
              })
            : "N/A"}
        </span>
      ),
    },
    { key: "estado", label: "Estado" },
  ];

  if (isLoading) {
    return <span>Cargando datos...</span>;
  }

  if (isError) {
    return <span>Error: {error?.message}</span>;
  }

  const sitiosWithKey = sitios
    ?.filter((sitio) => sitio?.id_sitio !== undefined)
    .map((sitio) => ({
      ...sitio,
      key: sitio.id_sitio ? sitio.id_sitio.toString() : crypto.randomUUID(),
      id_sitio: sitio.id_sitio || 0,
      estado: Boolean(sitio.estado),
    }));

  return (
    <div className="p-4">
      <div className="flex pb-4 pt-4">
        <Card className="w-full">
          <CardBody>
            <div className="flex items-center justify-center">
              <h1 className="text-2xl font-bold">Gestionar Sitios</h1>
            </div>
          </CardBody>
        </Card>
      </div>
      <Modall
        ModalTitle="Agregar Sitio"
        isOpen={isOpen}
        onOpenChange={handleClose}
      >
        <Formulario
          id="sitio-form"
          addData={handleAddSitio}
          onClose={handleClose}
        />
        <button
          type="submit"
          form="sitio-form"
          className="bg-blue-500 text-white p-2 rounded-md"
        >
          Guardar
        </button>
      </Modall>

      <Modall
        ModalTitle="Editar Sitio"
        isOpen={IsOpenUpdate}
        onOpenChange={handleCloseUpdate}
      >
        {selectedSitio && (
          <FormUpdate
            sitios={sitiosWithKey ?? []}
            sitioId={selectedSitio.id_sitio as number}
            id="FormUpdate"
            onclose={handleCloseUpdate}
          />
        )}
      </Modall>

      {sitiosWithKey && (
        <Globaltable
          data={sitiosWithKey}
          columns={columns}
          onEdit={handleEdit}
          onDelete={(sitio) => handleState(sitio.id_sitio)}
          extraHeaderContent={
            <Buton
              text="Añadir sitio"
              onPress={() => setIsOpen(true)}
              type="button"
              variant="solid"
              className="text-white bg-blue-700"
            />
          }
        />
      )}
    </div>
  );
};

export default SitiosTable;
