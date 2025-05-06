import Globaltable from "@/components/organismos/table.tsx"; // Importar la tabla reutilizable
import { TableColumn } from "@/components/organismos/table.tsx";
import Buton from "@/components/molecules/Buton";
import Modall from "@/components/molecules/modal";
import { useState } from "react";
import { useMovimiento } from "@/hooks/Movimientos/useMovimiento";
import { Movimiento } from "@/types/Movimiento";
import Formulario from "@/components/organismos/Movimientos/FormRegister";
import { FormUpdate } from "@/components/organismos/Movimientos/FormUpdate";
import { Chip } from "@heroui/chip";
import { useNavigate } from "react-router-dom";
import { Button, Card, CardBody } from "@heroui/react";

export const MovimientoTable = () => {
  const { movimientos, isLoading, isError, error, addMovimiento } =
    useMovimiento();

  //Modal agregar
  const [isOpen, setIsOpen] = useState(false);
  const handleClose = () => setIsOpen(false);

  //Modal actualizar
  const [IsOpenUpdate, setIsOpenUpdate] = useState(false);
  const [selectedMovimiento, setSelectedMovimiento] =
    useState<Movimiento | null>(null);

    const navigate = useNavigate()

    const handleGoToTipo = () => {
      navigate('/bodega/tipos')
    }
    const handleGoToSitio = () => {
      navigate('/admin/sitios')
    }

  const handleCloseUpdate = () => {
    setIsOpenUpdate(false);
    setSelectedMovimiento(null);
  };

  const handleAddMovimiento = async (movimiento: Movimiento) => {
    try {
      await addMovimiento(movimiento);
      handleClose(); // Cerrar el modal después de darle agregar usuario
    } catch (error) {
      console.error("Error al agregar el usuario:", error);
    }
  };

  const handleEdit = (movimiento: Movimiento) => {
    setSelectedMovimiento(movimiento);
    setIsOpenUpdate(true);
  };

  // Definir las columnas de la tabla
  const columns: TableColumn<Movimiento>[] = [
    { key: "descripcion", label: "Descripcion" },
    { key: "cantidad", label: "Cantidad" },
    { key: "hora_ingreso", label: "Ingreso" },
    { key: "hora_salida", label: "Salida" },
    {
      key: "tipo_bien",
      label: "Tipo Movimiento",
      render: (movimiento: Movimiento) => (
        <span>
          {movimiento.devolutivo
            ? "Devolutivo"
            : movimiento.no_devolutivo
              ? "No Devolutivo"
              : "No especificado"}
        </span>
      ),
    },
    {
      key: "created_at",
      label: "Fecha Creación",
      render: (movimiento: Movimiento) => (
        <span>
          {movimiento.created_at
            ? new Date(movimiento.created_at).toLocaleDateString("es-ES", {
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
      render: (movimiento: Movimiento) => (
        <span>
          {movimiento.updated_at
            ? new Date(movimiento.updated_at).toLocaleDateString("es-ES", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
              })
            : "N/A"}
        </span>
      ),
    },
    {
      key: "estado",
      label: "Estado",
      render: (item) => {
        if (item.aceptado)
          return (
            <Chip color="success" variant="flat">
              Aceptado
            </Chip>
          );
        if (item.cancelado)
          return (
            <Chip color="danger" variant="flat">
              Cancelado
            </Chip>
          );
        if (item.en_proceso)
          return (
            <Chip color="warning" variant="flat">
              Pendiente
            </Chip>
          );
        return <Chip color="default">Sin estado</Chip>;
      },
    },
  ];

  if (isLoading) {
    return <span>Cargando datos...</span>;
  }

  if (isError) {
    return <span>Error: {error?.message}</span>;
  }

  const MovimientoWithKey = movimientos
    ?.filter((movimiento) => movimiento?.id_movimiento !== undefined)
    .map((movimiento) => ({
      ...movimiento,
      key: movimiento.id_movimiento
        ? movimiento.id_movimiento.toString()
        : crypto.randomUUID(),
        id_movimiento: movimiento.id_movimiento || 0
    }));

  return (
    <div className="p-4">
      <div className="flex pb-4 pt-4">
        <Card className="w-full">
          <CardBody>
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold">Gestionar Movimientos</h1>
              <div className="flex gap-2">
                <Button
                  className="text-white bg-blue-700"
                  onPress={handleGoToTipo}
                >
                  Gestionar Tipos Movimiento
                </Button>
                <Button
                  className="text-white bg-blue-700"
                  onPress={handleGoToSitio}
                >
                  Gestionar Sitios 
                </Button>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
      <Modall
        ModalTitle="Registrar Nuevo Movimiento"
        isOpen={isOpen}
        onOpenChange={handleClose}
      >
        <Formulario
          id="movimiento-form"
          addData={handleAddMovimiento}
          onClose={handleClose}
        />
      <div className="justify-center pt-2">
        <Button
          type="submit"
          form="movimiento-form"
          className="w-full bg-blue-700 text-white p-2 rounded-xl"
        >
          Guardar
        </Button>
      </div>
      </Modall>

      <Modall
        ModalTitle="Editar Movimiento"
        isOpen={IsOpenUpdate}
        onOpenChange={handleCloseUpdate}
      >
        {selectedMovimiento && (
          <FormUpdate
            movimientos={MovimientoWithKey ?? []}
            movimientoId={selectedMovimiento.id_movimiento as number}
            id="FormUpdate"
            onclose={handleCloseUpdate}
          />
        )}
      </Modall>

      {MovimientoWithKey && (
        <Globaltable
          data={MovimientoWithKey}
          columns={columns}
          onEdit={handleEdit}
          showEstado={false}
          extraHeaderContent={
            <Buton
              text="Nuevo Movimiento"
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
