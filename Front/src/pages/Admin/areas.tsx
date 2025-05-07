import Globaltable from "@/components/organismos/table.tsx"; // Importar la tabla reutilizable
import { TableColumn } from "@/components/organismos/table.tsx";
import Buton from "@/components/molecules/Buton";
import Modall from "@/components/molecules/modal";
import Formulario from "@/components/organismos/areas/FormRegister";
import { useState } from "react";
import { Area } from "@/types/area";
import { useAreas } from "@/hooks/areas/useAreas";
import { Button, Card, CardBody } from "@heroui/react";
import { useNavigate } from "react-router-dom";
import { FormUpdate } from "@/components/organismos/areas/Formupdate";

const AreaTable = () => {
  const { areas, isLoading, isError, error, addArea, changeState } = useAreas();

  //Modal agregar
  const [isOpen, setIsOpen] = useState(false);
  const handleClose = () => setIsOpen(false);

  //Modal actualizar
  const [IsOpenUpdate, setIsOpenUpdate] = useState(false);
  const [selectedArea, setSelectedArea] = useState<Area | null>(null);
  const navigate = useNavigate();

  const handleGoToUsuario = () => {
    navigate("/admin/usuarios");
  };

  const handleCloseUpdate = () => {
    setIsOpenUpdate(false);
    setSelectedArea(null);
  };

  const handleState = async (id_area: number) => {
    await changeState(id_area);
  };

  const handleAddArea = async (area: Area) => {
    try {
      const areaToAdd = { ...area, id_area: area.id_area || 0 };
      await addArea(areaToAdd);
      handleClose();
    } catch (error) {
      console.error("Error al agregar el area:", error);
    }
  };

  const handleEdit = (area: Area) => {
    setSelectedArea(area);
    setIsOpenUpdate(true);
  };

  // Definir las columnas de la tabla
  const columns: TableColumn<Area>[] = [
    { key: "nombre", label: "Nombre" },
    {
      key: "created_at",
      label: "Fecha Creación",
      render: (Area: Area) => (
        <span>
          {Area.created_at
            ? new Date(Area.created_at).toLocaleDateString("es-ES", {
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
      label: "Fecha Actualizacion",
      render: (Area: Area) => (
        <span>
          {Area.updated_at
            ? new Date(Area.updated_at).toLocaleDateString("es-ES", {
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

  const areasWithKey = areas
    ?.filter(
      (area) =>
        area?.id_area !== undefined && area?.created_at && area?.updated_at
    )
    .map((area) => ({
      ...area,
      key: area.id_area ? area.id_area.toString() : crypto.randomUUID(), // Asegurando que el key sea único
      estado: Boolean(area.estado), // Asegurar que estado sea un booleano
      id_area: area.id_area || 0, // Asegurar que id_area no sea undefined, asignando 0 si es necesario
    }));

  return (
    <div className="p-4">
      <div className="flex pb-4 pt-4">
        <Card className="w-full">
          <CardBody>
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold">Gestionar Areas</h1>
              <div className="flex gap-2">
                <Button
                  className="text-white bg-blue-700"
                  onPress={handleGoToUsuario}
                >
                  Gestionar Usuarios
                </Button>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
      <Modall
        ModalTitle="Agregar Area"
        isOpen={isOpen}
        onOpenChange={handleClose}
      >
        <Formulario
          id="area-form"
          addData={handleAddArea}
          onClose={handleClose}
        />
        <div className="justify-center pt-2">
          <Button
            type="submit"
            form="area-form"
            className="w-full bg-blue-700 text-white p-2 rounded-xl"
          >
            Guardar
          </Button>
        </div>
      </Modall>

      <Modall
        ModalTitle="Editar Area"
        isOpen={IsOpenUpdate}
        onOpenChange={handleCloseUpdate}
      >
        {selectedArea && (
          <FormUpdate
            areas={areasWithKey ?? []}
            areaId={selectedArea.id_area as number}
            id="FormUpdate"
            onclose={handleCloseUpdate}
          />
        )}
      </Modall>

      {areasWithKey && (
        <Globaltable
          data={areasWithKey}
          columns={columns}
          onEdit={handleEdit}
          onDelete={(area) => handleState(area.id_area)}
          extraHeaderContent={
            <Buton
              text="Añadir Area"
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

export default AreaTable;
