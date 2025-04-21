import Globaltable from "@/components/organismos/table.tsx"; // Importar la tabla reutilizable
import { TableColumn } from "@/components/organismos/table.tsx";
import Buton from "@/components/molecules/Buton";
import Modall from "@/components/molecules/modal";
import { useState } from "react";
import { Chip } from "@heroui/chip";
import { useTipoMovimiento } from "@/hooks/TiposMovimento/useTipoMovimiento";
import { TipoMovimiento } from "@/types/TipoMovimiento";
import Formulario from "@/components/organismos/TiposMovimiento/FormRegister";
import { FormUpdate } from "@/components/organismos/TiposMovimiento/FormUpdate";

export const TipoMovimientoTable = () => {
  const { tipos, isLoading, isError, error, addTipoMovimiento, changeState } =
    useTipoMovimiento();

  //Modal agregar
  const [isOpen, setIsOpen] = useState(false);
  const handleClose = () => setIsOpen(false);

  //Modal actualizar
  const [IsOpenUpdate, setIsOpenUpdate] = useState(false);
  const [selectedTipoMovimiento, setSelectedTipoMovimiento] = useState<TipoMovimiento | null>(
    null
  );

  const handleCloseUpdate = () => {
    setIsOpenUpdate(false);
    setSelectedTipoMovimiento(null);
  };

  const handleState = async (tipo: TipoMovimiento) => {
    await changeState(tipo.id_tipo);
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
      render: (rol: TipoMovimiento) => (
        <span>{new Date(rol.created_at).toLocaleDateString("es-ES", { year: 'numeric', month: '2-digit', day: '2-digit' })}</span>
      ),
    },
    {
      key: "updated_at",
      label: "Fecha Actualización",
      render: (rol: TipoMovimiento) => (
        <span>{new Date(rol.updated_at).toLocaleDateString("es-ES", { year: 'numeric', month: '2-digit', day: '2-digit' })}</span>
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
      key: tipo.id_tipo
        ? tipo.id_tipo.toString()
        : crypto.randomUUID(),
      estado: Boolean(tipo.estado),
    }));

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">
        Tipos de Movimientos Registrados
      </h1>

      <Buton
        text="Nuevo tipo"
        onPress={() => setIsOpen(true)}
        type="button"
        color="primary"
        variant="solid"
        className="mb-8"
      />

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
        <button
          type="submit"
          form="tipo-form"
          className="bg-blue-500 text-white p-2 rounded-md"
        >
          Guardar
        </button>
      </Modall>

      <Modall
        ModalTitle="Editar Tipo de Movimiento"
        isOpen={IsOpenUpdate}
        onOpenChange={handleCloseUpdate}
      >
        {selectedTipoMovimiento && (
          <FormUpdate
            tipos={TipoMovimientosWithKey ?? []}
            tipoId={selectedTipoMovimiento.id_tipo}
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
          onDelete={handleState}
        />
      )}
    </div>
  );
};
