import Globaltable from "@/components/organismos/table.tsx"; // Importar la tabla reutilizable
import { TableColumn } from "@/components/organismos/table.tsx";
import Buton from "@/components/molecules/Buton";
import Modall from "@/components/molecules/modal";
import Formulario from "@/components/organismos/fichas/FormRegister";
import { useState } from "react";
import { useFichas } from "@/hooks/fichas/useFichas";
import { Ficha } from "@/types/Ficha";
import { Button, Card, CardBody } from "@heroui/react";
import { useNavigate } from "react-router-dom";
import { FormUpdateFicha } from "@/components/organismos/fichas/Formupdate";

const FichasTable = () => {
  const { fichas, isLoading, isError, error, addFicha, changeState } =
    useFichas();

  // Modal agregar
  const [isOpen, setIsOpen] = useState(false);
  const handleClose = () => setIsOpen(false);

  // Modal actualizar
  const [IsOpenUpdate, setIsOpenUpdate] = useState(false);
  const [selectedFicha, setSelectedFicha] = useState<Ficha | null>(null);
  const navigate = useNavigate()

  const handleGoToPrograma = () => {
    navigate('/admin/programas')
  }

  const handleCloseUpdate = () => {
    setIsOpenUpdate(false);
    setSelectedFicha(null);
  };

  const handleState = async (id_ficha: number) => {
    await changeState(id_ficha);
  };

  const handleAddFicha = async (ficha: Ficha) => {
    try {
      await addFicha(ficha);
      handleClose();
    } catch (error) {
      console.error("Error al agregar la ficha:", error);
    }
  };

  const handleEdit = (ficha: Ficha) => {
    setSelectedFicha(ficha);
    setIsOpenUpdate(true);
  };

  // Definir las columnas de la tabla
  const columns: TableColumn<Ficha>[] = [
    { key: "codigo_ficha", label: "Codigo ficha" },
    {
      key: "created_at",
      label: "Fecha CReacion",
      render: (ficha: Ficha) => (
        <span>
          {ficha.created_at
            ? new Date(ficha.created_at).toLocaleDateString("es-ES", {
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
      render: (ficha: Ficha) => (
        <span>
          {ficha.updated_at
            ? new Date(ficha.updated_at).toLocaleDateString("es-ES", {
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

  const fichasWithKey = fichas
    ?.filter(
      (ficha) =>
        ficha?.id_ficha !== undefined && ficha?.created_at && ficha?.updated_at
    )
    .map((ficha) => ({
      ...ficha,
      key: ficha.id_ficha ? ficha.id_ficha.toString() : crypto.randomUUID(),
      id_ficha: ficha.id_ficha || 0,
      estado: Boolean(ficha.estado),
    }));

  return (
    <div className="p-4">
      <div className="flex pb-4 pt-4">
        <Card className="w-full">
          <CardBody>
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold">Gestionar Fichas</h1>
              <div className="flex gap-2">
                <Button className="text-white bg-blue-700" onPress={handleGoToPrograma}>Gestionar Programas</Button>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      <Modall
        ModalTitle="Agregar Ficha"
        isOpen={isOpen}
        onOpenChange={handleClose}
      >
        <Formulario
          id="ficha-form"
          addData={handleAddFicha}
          onClose={handleClose}
        />
      <div className="justify-center pt-2">
        <Button
          type="submit"
          form="ficha-form"
          className="w-full bg-blue-700 text-white p-2 rounded-xl"
        >
          Guardar
        </Button>
      </div>
      </Modall>

      <Modall
        ModalTitle="Editar Ficha"
        isOpen={IsOpenUpdate}
        onOpenChange={handleCloseUpdate}
      >
        {selectedFicha && (
          <FormUpdateFicha
            fichas={fichasWithKey ?? []}
            fichaId={selectedFicha.id_ficha as number}
            id="FormUpdate"
            onclose={handleCloseUpdate}
          />
        )}
      </Modall>

      {fichasWithKey && (
        <Globaltable
          data={fichasWithKey}
          columns={columns}
          onEdit={handleEdit}
          onDelete={(ficha) => handleState(ficha.id_ficha)}
          extraHeaderContent={
            <Buton
              text="Añadir Ficha"
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

export default FichasTable;
