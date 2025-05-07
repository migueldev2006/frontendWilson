import Globaltable from "@/components/organismos/table.tsx"; // Importar la tabla reutilizable
import { TableColumn } from "@/components/organismos/table.tsx";
import Buton from "@/components/molecules/Buton";
import Modall from "@/components/molecules/modal";
import Formulario from "@/components/organismos/permisos/FormRegister";
import { useState } from "react";
import { Permisos } from "@/types/permisos";
import { usePermisos } from "@/hooks/permisos/usePermisos";
import { FormUpdate } from "@/components/organismos/permisos/Formupdate";
import { Button } from "@heroui/button";

const PermisoTable = () => {
  const { permiso, isLoading, isError, error, addPermiso } = usePermisos();

  //Modal agregar
  const [isOpen, setIsOpen] = useState(false);
  const handleClose = () => setIsOpen(false);

  //Modal actualizar
  const [IsOpenUpdate, setIsOpenUpdate] = useState(false);
  const [selectedPermisos, setSelectedPermiso] = useState<Permisos | null>(
    null
  );

  const handleCloseUpdate = () => {
    setIsOpenUpdate(false);
    setSelectedPermiso(null);
  };

  // const handleState = async (user: Permisos) => {
  //     await changeState(user.id_permiso);
  // }

  const handleAddUser = async (permiso: Permisos) => {
    try {
      await addPermiso(permiso);
      handleClose(); // Cerrar el modal después de darle agregar usuario
    } catch (error) {
      console.error("Error al agregar el permiso:", error);
    }
  };

  const handleEdit = (permiso: Permisos) => {
    setSelectedPermiso(permiso);
    setIsOpenUpdate(true);
  };

  // Definir las columnas de la tabla
  const columns: TableColumn<Permisos>[] = [
    { key: "permiso", label: "permiso" },
  ];

  if (isLoading) {
    return <span>Cargando datos...</span>;
  }

  if (isError) {
    return <span>Error: {error?.message}</span>;
  }

  const PermisoWithKey = permiso
    ?.filter((permiso) => permiso?.id_permiso !== undefined)
    .map((permiso) => ({
      ...permiso,
      key: permiso.id_permiso
        ? permiso.id_permiso.toString()
        : crypto.randomUUID(),
      estado: Boolean(permiso.id_permiso),
    }));

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">Tabla de Permiso</h1>

      <Modall
        ModalTitle="Agregar permiso"
        isOpen={isOpen}
        onOpenChange={handleClose}
      >
        <Formulario
          id="permiso-form"
          addData={handleAddUser}
          onClose={handleClose}
        />
      <div className="justify-center pt-2">
        <Button
          type="submit"
          form="permiso-form"
          className="w-full bg-blue-700 text-white p-2 rounded-xl"
        >
          Guardar
        </Button>
      </div>
      </Modall>

      <Modall
        ModalTitle="Editar permiso"
        isOpen={IsOpenUpdate}
        onOpenChange={handleCloseUpdate}
      >
        {selectedPermisos && (
          <FormUpdate
            permisos={PermisoWithKey ?? []}
            permisoId={selectedPermisos.id_permiso as number}
            id="FormUpdate"
            onclose={handleCloseUpdate}
          />
        )}
      </Modall>

      {PermisoWithKey && (
        <Globaltable
          data={PermisoWithKey}
          columns={columns}
          onEdit={handleEdit}
          onDelete={() => {}}
          extraHeaderContent={
            <Buton
              text="Añadir permiso"
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

export default PermisoTable;
