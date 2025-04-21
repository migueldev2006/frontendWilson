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

export const MovimientoTable = () => {
  const { movimientos, isLoading, isError, error, addMovimiento } =
    useMovimiento();

  //Modal agregar
  const [isOpen, setIsOpen] = useState(false);
  const handleClose = () => setIsOpen(false);

  //Modal actualizar
  const [IsOpenUpdate, setIsOpenUpdate] = useState(false);
  const [selectedMovimiento, setSelectedMovimiento] = useState<Movimiento | null>(
    null
  );

  const handleCloseUpdate = () => {
    setIsOpenUpdate(false);
    setSelectedMovimiento(null);
  };

  const handleAddMovimiento = async (elemento: Movimiento) => {
    try {
      await addMovimiento(elemento);
      handleClose(); // Cerrar el modal después de darle agregar usuario
    } catch (error) {
      console.error("Error al agregar el usuario:", error);
    }
  };

  const handleEdit = (elemento: Movimiento) => {
    setSelectedMovimiento(elemento);
    setIsOpenUpdate(true);
  };

  // Definir las columnas de la tabla
  const columns: TableColumn<Movimiento>[] = [
    { key: "descripcion", label: "Descripcion" },
    { key: "cantidad", label: "Cantidad" },
    { key: "hora_ingreso", label: "Ingreso" },
    { key: "hora_salida", label: "Salida" },
    {
      key: "tipo_movimiento",
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
          {new Date(movimiento.created_at).toLocaleDateString("es-ES", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          })}
        </span>
      ),
    },
    {
      key: "updated_at",
      label: "Fecha Actualización",
      render: (movimiento: Movimiento) => (
        <span>
          {new Date(movimiento.updated_at).toLocaleDateString("es-ES", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          })}
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
    ?.filter((elemento) => elemento?.id_movimiento !== undefined)
    .map((elemento) => ({
      ...elemento,
      key: elemento.id_movimiento
        ? elemento.id_movimiento.toString()
        : crypto.randomUUID(),

    }));

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">
        Movimiento Registrados
      </h1>

      <Buton
        text="Nuevo Movimiento"
        onPress={() => setIsOpen(true)}
        type="button"
        color="primary"
        variant="solid"
        className="mb-8"
      />

      <Modall
        ModalTitle="Registrar Nuevo Movimiento"
        isOpen={isOpen}
        onOpenChange={handleClose}
      >
        <Formulario
          id="element-form"
          addData={handleAddMovimiento}
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
        ModalTitle="Editar Movimiento"
        isOpen={IsOpenUpdate}
        onOpenChange={handleCloseUpdate}
      >
        {selectedMovimiento && (
          <FormUpdate
            movimientos={MovimientoWithKey ?? []}
            movimientoId={selectedMovimiento.id_movimiento}
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
        onDelete={()=> {}}
        />
      )}
    </div>
  );
};
