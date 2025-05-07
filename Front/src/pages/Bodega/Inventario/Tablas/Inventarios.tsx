import Globaltable from "@/components/organismos/table.tsx"; // Importar la tabla reutilizable
import { TableColumn } from "@/components/organismos/table.tsx";
import Buton from "@/components/molecules/Buton";
import Modall from "@/components/molecules/modal";
import { useState } from "react";
import Formulario from "@/components/organismos/Inventarios/FormRegister";
import { useInventario } from "@/hooks/Inventarios/useInventario";
import { Inventario } from "@/types/Inventario";
import { Elemento } from "@/types/Elemento";
import { useElemento } from "@/hooks/Elementos/useElemento";
import { Button } from "@heroui/button";

interface InventariosTableProps {
  inventarios?: Inventario[];
  idSitio?: number;
}

export const InventariosTable = ({
  inventarios: inventariosProp,
  idSitio,
}: InventariosTableProps) => {
  const {
    inventarios: inventariosHook,
    isLoading,
    isError,
    error,
    addInventario,
    changeState,
  } = useInventario();
  const { elementos: elementos } = useElemento();
  //Modal agregar
  const [isOpen, setIsOpen] = useState(false);
  const handleClose = () => setIsOpen(false);

  //Modal actualizar
  // const [IsOpenUpdate, setIsOpenUpdate] = useState(false);
  // const [selectedInventario, setSelectedInventario] =
  //   useState<Inventario | null>(null);

  // const handleCloseUpdate = () => {
  //   setIsOpenUpdate(false);
  //   setSelectedInventario(null);
  // };

  const handleState = async (id_inventario: number) => {
    await changeState(id_inventario);
  };

  const handleAddInventario = async (inventario: Inventario) => {
    try {
      await addInventario(inventario);
      handleClose();
    } catch (error) {
      console.error("Error al agregar al inventario:", error);
    }
  };

  // const handleEdit = (inventario: Inventario) => {
  //   setSelectedInventario(inventario);
  //   setIsOpenUpdate(true);
  // };

  // Definir las columnas de la tabla
  const columns = (elementos: Elemento[]): TableColumn<Inventario>[] => [
    {
      key: "fk_elemento",
      label: "Elemento",
      render: (inventario: Inventario) => {
        const elemento = elementos.find(
          (el) => el.id_elemento === inventario.fk_elemento
        );
        return <span>{elemento?.nombre ?? "No encontrado"}</span>;
      },
    },
    {
      key: "imagen_elemento",
      label: "Imagen",
      render: (inventario: Inventario) => {
        const elemento = elementos.find(
          (el) => el.id_elemento === inventario.fk_elemento
        );

        const imagen = elemento?.imagen_elemento;

        if (!imagen) return <span>No encontrado</span>;

        const src = `http://localhost:3000/img/${imagen}`;

        return (
          <img
            src={src}
            alt="Imagen del elemento"
            className="justify-center relative left-6 h-28 rounded shadow"
          />
        );
      },
    },
    { key: "stock", label: "Cantidad" },
    {
      key: "created_at",
      label: "Fecha Creación",
      render: (inventario: Inventario) => (
        <span>
          {inventario.created_at
            ? new Date(inventario.created_at).toLocaleDateString("es-ES", {
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
      render: (inventario: Inventario) => (
        <span>
          {inventario.updated_at
            ? new Date(inventario.updated_at).toLocaleDateString("es-ES", {
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

  if (isLoading && !inventariosProp) {
    return <span>Cargando datos...</span>;
  }

  if (isError && !inventariosProp) {
    return <span>Error: {error?.message}</span>;
  }

  const filtered = inventariosProp ?? inventariosHook;

  const InventariosWithKey = filtered
    ?.filter(
      (inventario) =>
        inventario?.id_inventario !== undefined &&
        (idSitio ? inventario.fk_sitio === idSitio : true)
    )
    .map((inventario) => ({
      ...inventario,
      key: inventario.id_inventario
        ? inventario.id_inventario.toString()
        : crypto.randomUUID(),
      id_inventario: inventario.id_inventario || 0,
      estado: Boolean(inventario.estado),
    }));

  return (
    <div className="p-4">
      {!idSitio && (
        <h1 className="text-2xl font-bold mb-4 text-center">
          Inventarios Registrados
        </h1>
      )}
      <Modall
        ModalTitle="Registrar Nuevo Inventario"
        isOpen={isOpen}
        onOpenChange={handleClose}
      >
        <Formulario
          id="inventario-form"
          addData={handleAddInventario}
          onClose={handleClose}
          idSitio={idSitio!}
        />
      <div className="justify-center pt-2">
        <Button
          type="submit"
          form="inventario-form"
          className="w-full bg-blue-700 text-white p-2 rounded-xl"
        >
          Guardar
        </Button>
      </div>
      </Modall>

      {InventariosWithKey && (
        <Globaltable
          data={InventariosWithKey}
          columns={columns(elementos ?? [])}
          onDelete={(inventario) => handleState(inventario.id_inventario)}
          extraHeaderContent={
            <Buton
              text="Nuevo inventario"
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
