import Globaltable from "@/components/organismos/table.tsx"; // Importar la tabla reutilizable
import { TableColumn } from "@/components/organismos/table.tsx";
import Buton from "@/components/molecules/Buton";
import Modall from "@/components/molecules/modal";
import { useState } from "react";
import { useTipoMovimiento } from "@/hooks/TiposMovimento/useTipoMovimiento";
import Formulario from "@/components/organismos/TiposMovimiento/FormRegister";
import { FormUpdate } from "@/components/organismos/TiposMovimiento/FormUpdate";
import { TipoMovimiento } from "@/types/TipoMovimiento";
import { Button, Card, CardBody } from "@heroui/react";
import { useNavigate } from "react-router-dom";

export const TipoMovimientoTable = () => {
  const { tipos, isLoading, isError, error, addTipoMovimiento, changeState } =
    useTipoMovimiento();

  //Modal agregar
  const [isOpen, setIsOpen] = useState(false);
  const handleClose = () => setIsOpen(false);

  //Modal actualizar
  const [IsOpenUpdate, setIsOpenUpdate] = useState(false);
  const [selectedTipoMovimiento, setSelectedTipoMovimiento] =
    useState<TipoMovimiento | null>(null);

    const navigate = useNavigate()

    const handleGoToElemento = () => {
      navigate('/bodega/movimientos')
    }

  const handleCloseUpdate = () => {
    setIsOpenUpdate(false);
    setSelectedTipoMovimiento(null);
  };

  const handleState = async (id_tipo: number) => {
    await changeState(id_tipo);
  };

  const handleAddTipoMovimiento = async (tipo: TipoMovimiento) => {
    try {
      await addTipoMovimiento(tipo);
      handleClose(); // Cerrar el modal después de darle agregar usuario
    } catch (error) {
      console.error("Error al agregar el tipo de movimiento:", error);
    }
  };

  const handleEdit = (tipo: TipoMovimiento) => {
    setSelectedTipoMovimiento(tipo);
    setIsOpenUpdate(true);
  };

  // Definir las columnas de la tabla
  const columns: TableColumn<TipoMovimiento>[] = [
    { key: "nombre", label: "Nombre" },
    {
      key: "created_at",
      label: "Fecha Creación",
      render: (tipo: TipoMovimiento) => (
        <span>
          {tipo.created_at
            ? new Date(tipo.created_at).toLocaleDateString("es-ES", {
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
      render: (tipo: TipoMovimiento) => (
        <span>
          {tipo.updated_at
            ? new Date(tipo.updated_at).toLocaleDateString("es-ES", {
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

  const TipoMovimientosWithKey = tipos
    ?.filter((tipo) => tipo?.id_tipo !== undefined)
    .map((tipo) => ({
      ...tipo,
      key: tipo.id_tipo ? tipo.id_tipo.toString() : crypto.randomUUID(),
      id_tipo: tipo.id_tipo || 0,
      estado: Boolean(tipo.estado),
    }));

  return (
    <div className="p-4">
      <div className="flex pb-4 pt-4">
        <Card className="w-full">
          <CardBody>
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold">Gestionar Tipos</h1>
              <div className="flex gap-2">
                <Button
                  className="text-white bg-blue-700"
                  onPress={handleGoToElemento}
                >
                  Movimientos
                </Button>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      <Modall
        ModalTitle="Registrar Nuevo Tipo de Movimiento"
        isOpen={isOpen}
        onOpenChange={handleClose}
      >
        <Formulario
          id="tipo-form"
          addData={handleAddTipoMovimiento}
          onClose={handleClose}
        />
        <Button
          type="submit"
          form="tipo-form"
          className="w-full bg-blue-700 text-white p-2 rounded-xl"
        >
          Guardar
        </Button>
      </Modall>

      <Modall
        ModalTitle="Editar Tipo de Movimiento"
        isOpen={IsOpenUpdate}
        onOpenChange={handleCloseUpdate}
      >
        {selectedTipoMovimiento && (
          <FormUpdate
            tipos={TipoMovimientosWithKey ?? []}
            tipoId={selectedTipoMovimiento.id_tipo as number}
            id="FormUpdate"
            onclose={handleCloseUpdate}
          />
        )}
      </Modall>

      {TipoMovimientosWithKey && (
        <Globaltable
          data={TipoMovimientosWithKey}
          columns={columns}
          onEdit={handleEdit}
          onDelete={(tipo) => handleState(tipo.id_tipo)}
          extraHeaderContent={
            <Buton
              text="Nuevo tipo"
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
