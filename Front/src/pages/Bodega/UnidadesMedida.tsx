import Globaltable from "@/components/organismos/table.tsx"; // Importar la tabla reutilizable
import { TableColumn } from "@/components/organismos/table.tsx";
import Buton from "@/components/molecules/Buton";
import Modall from "@/components/molecules/modal";
import { useState } from "react";
import { useUnidad } from "@/hooks/UnidadesMedida/useUnidad";
import Formulario from "@/components/organismos/UnidadesMedida/FormRegister";
import { FormUpdate } from "@/components/organismos/UnidadesMedida/FormUpdate";
import { Unidad } from "@/types/Unidad";
import { Button, Card, CardBody } from "@heroui/react";
import { useNavigate } from "react-router-dom";

export const UnidadTable = () => {
  const { unidades, isLoading, isError, error, addUnidad, changeState } =
    useUnidad();

  //Modal agregar
  const [isOpen, setIsOpen] = useState(false);
  const handleClose = () => setIsOpen(false);

  //Modal actualizar
  const [IsOpenUpdate, setIsOpenUpdate] = useState(false);
  const [selectedUnidad, setSelectedUnidad] = useState<Unidad | null>(null);

  const navigate = useNavigate()

  const handleGoToElemento = () => {
    navigate('/bodega/elementos')
  }
  
  const handleCloseUpdate = () => {
    setIsOpenUpdate(false);
    setSelectedUnidad(null);
  };

  const handleState = async (id_unidad:number) => {
    await changeState(id_unidad);
  };

  const handleAddUnidad = async (unidad: Unidad) => {
    try {
      await addUnidad(unidad);
      handleClose(); // Cerrar el modal después de darle agregar usuario
    } catch (error) {
      console.error("Error al agregar la unidad:", error);
    }
  };

  const handleEdit = (unidad: Unidad) => {
    if (!unidad || !unidad.id_unidad) {
      return; 
    }
    setSelectedUnidad(unidad);
    setIsOpenUpdate(true);
  };

  // Definir las columnas de la tabla
  const columns: TableColumn<Unidad>[] = [
    { key: "nombre", label: "Nombre" },
    {
      key: "created_at",
      label: "Fecha Creación",
      render: (unidad: Unidad) => (
        <span>
          {unidad.created_at
            ? new Date(unidad.created_at).toLocaleDateString("es-ES", {
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
      render: (unidad: Unidad) => (
        <span>
          {unidad.updated_at
            ? new Date(unidad.updated_at).toLocaleDateString("es-ES", {
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

  const UnidadsWithKey = unidades
    ?.filter((unidad) => unidad?.id_unidad !== undefined)
    .map((unidad) => ({
      ...unidad,
      key: unidad.id_unidad ? unidad.id_unidad.toString() : crypto.randomUUID(),
      id_unidad: unidad.id_unidad || 0,
      estado: Boolean(unidad.estado),
    }));

  return (
    <div className="p-4">
      <div className="flex pb-4 pt-4">
        <Card className="w-full">
          <CardBody>
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold">Gestionar Unidades</h1>
              <div className="flex gap-2">
                <Button
                  className="text-white bg-blue-700"
                  onPress={handleGoToElemento}
                >
                  Elementos
                </Button>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      <Modall
        ModalTitle="Registrar Nueva Unidad"
        isOpen={isOpen}
        onOpenChange={handleClose}
      >
        <Formulario
          id="unidad-form"
          addData={handleAddUnidad}
          onClose={handleClose}
        />
        <Button
          type="submit"
          form="unidad-form"
          className="w-full bg-blue-700 text-white p-2 rounded-xl"
        >
          Guardar
        </Button>
      </Modall>

      <Modall
        ModalTitle="Editar Unidad"
        isOpen={IsOpenUpdate}
        onOpenChange={handleCloseUpdate}
      >
        {selectedUnidad && (
          <FormUpdate
            unidades={UnidadsWithKey ?? []}
            unidadId={selectedUnidad.id_unidad as number}
            id="FormUpdate"
            onclose={handleCloseUpdate}
          />
        )}
      </Modall>

      {UnidadsWithKey && (
        <Globaltable
          data={UnidadsWithKey}
          columns={columns}
          onEdit={handleEdit}
          onDelete={(unidad) => handleState(unidad.id_unidad)}
          extraHeaderContent={
            <Buton
              text="Nueva unidad"
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
