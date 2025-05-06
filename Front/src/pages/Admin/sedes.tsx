import Globaltable from "@/components/organismos/table.tsx"; // Importar la tabla reutilizable
import { TableColumn } from "@/components/organismos/table.tsx";
import Buton from "@/components/molecules/Buton";
import Modall from "@/components/molecules/modal";
import Formulario from "@/components/organismos/Sedes/FormRegister";
import { useState } from "react";
import { useSede } from "@/hooks/sedes/useSedes";
import { Button, Card, CardBody } from "@heroui/react";
import { Sede } from "@/types/sedes";
import { useNavigate } from "react-router-dom";
import { FormUpdate } from "@/components/organismos/Sedes/Formupdate";

const SedeTable = () => {
  const { sede, isLoading, isError, error, addSede, changeState } = useSede();

  //Modal agregar
  const [isOpen, setIsOpen] = useState(false);
  const handleClose = () => setIsOpen(false);

  //Modal actualizar
  const [IsOpenUpdate, setIsOpenUpdate] = useState(false);
  const [selectedSede, setSelectedSede] = useState<Sede | null>(null);

  const navigate = useNavigate()

  const handleGoToCentro = () => {
    navigate("/admin/centros");
  };
  const handleGoToArea = () => {
    navigate("/admin/areas");
  };

  const handleCloseUpdate = () => {
    setIsOpenUpdate(false);
    setSelectedSede(null);
  };

  const handleState = async (sede: Sede) => {
    const id_sede = sede.id_sede ?? 0;
    await changeState(id_sede);
  };

  const handleAddSede = async (sede: Sede) => {
    try {
      const id_sede = sede.id_sede ?? 0;
      await addSede({ ...sede, id_sede });
      handleClose();
    } catch (error) {
      console.error("Error al agregar la sede:", error);
    }
  };

  const handleEdit = (sede: Sede) => {
    setSelectedSede(sede);
    setIsOpenUpdate(true);
  };

  // Definir las columnas de la tabla
  const columns: TableColumn<Sede>[] = [
    { key: "nombre", label: "Nombre" },
    {
      key: "created_at",
      label: "Fecha CReacion",
      render: (sede: Sede) => (
        <span>
          {sede.created_at
            ? new Date(sede.created_at).toLocaleDateString("es-ES", {
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
      render: (sede: Sede) => (
        <span>
          {sede.updated_at
            ? new Date(sede.updated_at).toLocaleDateString("es-ES", {
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

  const sedeWithKey = sede
    ?.filter((sede) => sede?.id_sede !== undefined)
    .map((sede) => ({
      ...sede,
      key: sede.id_sede ? sede.id_sede.toString() : crypto.randomUUID(),
      id_sede: sede.id_sede || 0,
      estado: Boolean(sede.estado),
    }));

  return (
    <div className="p-4">
      <div className="flex pb-4 pt-4">
        <Card className="w-full">
          <CardBody>
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold">Gestionar Sedes</h1>
              <div className="flex gap-2">
                <Button className="text-white bg-blue-700" onPress={handleGoToArea}>Areas</Button>
                <Button className="text-white bg-blue-700" onPress={handleGoToCentro}>Gestionar Centros </Button>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      <Modall
        ModalTitle="Agregar sede"
        isOpen={isOpen}
        onOpenChange={handleClose}
      >
        <Formulario
          id="sede-form"
          addData={handleAddSede}
          onClose={handleClose}
        />
      <div className="justify-center pt-2">
        <Button
          type="submit"
          form="sede-form"
          className="w-full bg-blue-700 text-white p-2 rounded-xl"
        >
          Guardar
        </Button>
      </div>
      </Modall>

      <Modall
        ModalTitle="Editar sede"
        isOpen={IsOpenUpdate}
        onOpenChange={handleCloseUpdate}
      >
        {selectedSede && (
          <FormUpdate
            sedes={sedeWithKey ?? []}
            sedeId={selectedSede.id_sede as number}
            id="FormUpdate"
            onclose={handleCloseUpdate}
          />
        )}
      </Modall>

      {sedeWithKey && (
        <Globaltable
          data={sedeWithKey}
          columns={columns}
          onEdit={handleEdit}
          onDelete={handleState}
          extraHeaderContent={
            <Buton
              text="Añadir sede"
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

export default SedeTable;
