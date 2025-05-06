import Globaltable from "@/components/organismos/table.tsx"; // Importar la tabla reutilizable
import { TableColumn } from "@/components/organismos/table.tsx";
import Buton from "@/components/molecules/Buton";
import Modall from "@/components/molecules/modal";
import FormModulos from "@/components/organismos/Modulos/FormModulos";
import { useState } from "react";
import FormUpModulo from "@/components/organismos/Modulos/FormUpModulo";
import { Modulo } from "@/schemas/Modulo";
import { useModulo } from "@/hooks/Modulos/useModulo";

const ModulosTable = () => {
  const { modulos, isLoading, isError, error, addModulo, changeState } =
    useModulo();

  //Modal agregar
  const [isOpen, setIsOpen] = useState(false);
  const handleClose = () => setIsOpen(false);

  //Modal actualizar
  const [IsOpenUpdate, setIsOpenUpdate] = useState(false);
  const [selectedModulo, setSelectedModulo] = useState<Modulo | null>(null);

  const handleCloseUpdate = () => {
    setIsOpenUpdate(false);
    setSelectedModulo(null);
  };

  const handleState = async (modulos: Modulo) => {
    await changeState(modulos.id_modulo);
    console.log(modulos.id_modulo);
  };

  const handleAddModulo = async (modulos: Modulo) => {
    try {
      await addModulo(modulos);
      handleClose(); // Cerrar el modal después de darle agregar usuario
    } catch (error) {
      console.error("Error al agregar el modulo:", error);
    }
  };

  const handleEdit = (modulos: Modulo) => {
    setSelectedModulo(modulos);
    setIsOpenUpdate(true);
  };

  // Definir las columnas de la tabla
  const columns: TableColumn<Modulo>[] = [
    { key: "nombre", label: "Nombre" },
    { key: "estado", label: "estado" },
    { key: "descripcion", label: "descripcion" },
  ];

  if (isLoading) {
    return <span>Cargando datos...</span>;
  }

  if (isError) {
    return <span>Error: {error?.message}</span>;
  }

  const ModulosWithKey = modulos
    ?.filter((modulos) => modulos?.id_modulo !== undefined)
    .map((modulos) => ({
      ...modulos,
      key: modulos.id_modulo
        ? modulos.id_modulo.toString()
        : crypto.randomUUID(),
      estado: Boolean(modulos.estado),
    }));

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">Tabla de Modulos</h1>

      <Modall
        ModalTitle="Agregar modulo"
        isOpen={isOpen}
        onOpenChange={handleClose}
      >
        <FormModulos
          id="user-form"
          addData={handleAddModulo}
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
        ModalTitle="Editar Modulo"
        isOpen={IsOpenUpdate}
        onOpenChange={handleCloseUpdate}
      >
        {selectedModulo && (
          <FormUpModulo
            modulos={ModulosWithKey ?? []}
            moduloId={selectedModulo.id_modulo}
            id="FormUpdate"
            onclose={handleCloseUpdate}
          />
        )}
      </Modall>

      {ModulosWithKey && (
        <Globaltable
          data={ModulosWithKey}
          columns={columns}
          onEdit={handleEdit}
          onDelete={handleState}
          extraHeaderContent={
            <Buton
            text="Añadir Modulo"
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

export default ModulosTable;
