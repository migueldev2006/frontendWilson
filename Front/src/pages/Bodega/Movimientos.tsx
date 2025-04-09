import Globaltable from "@/components/organismos/table.tsx"; // Importar la tabla reutilizable
import { TableColumn } from "@/components/organismos/table.tsx";
import Buton from "@/components/molecules/Buton";
import Modall from "@/components/molecules/modal";
import { useState } from "react";
import { useMovimiento } from "@/hooks/Movimientos/useMovimiento";
import { Movimiento } from "@/types/Movimiento";
import Formulario from "@/components/organismos/Movimientos/FormRegister";
import { FormUpdate } from "@/components/organismos/Movimientos/FormUpdate";

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

  // const handleState = async (elemento: Movimiento) => {
  //   await changeState(elemento.id_movimiento);
  // };

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
    { key: "created_at", label: "Fecha Creacion" },
    { key: "updated_at", label: "Fecha Actualizacion" },
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
        text="Nuevo elemento"
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
        ModalTitle="Editar Usuario"
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
