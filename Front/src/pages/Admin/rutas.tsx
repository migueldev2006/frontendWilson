import Globaltable from "@/components/organismos/table.tsx"; // Importar la tabla reutilizable
import { TableColumn } from "@/components/organismos/table.tsx";
import Buton from "@/components/molecules/Buton";
import Modall from "@/components/molecules/modal";
import FormRutas from "@/components/organismos/Rutas/FormRutas";
import { useState } from "react";
import FormUpRutas from "@/components/organismos/Rutas/FormUpRutas";
import { Ruta } from "@/schemas/Ruta";
import { useRuta } from "@/hooks/Rutas/useRuta";

const RutasTable = () => {
  const { rutas, isLoading, isError, error, addRuta, changeState } = useRuta();

  //Modal agregar
  const [isOpen, setIsOpen] = useState(false);
  const handleClose = () => setIsOpen(false);

  //Modal actualizar
  const [IsOpenUpdate, setIsOpenUpdate] = useState(false);
  const [selectedRuta, setSelectedRuta] = useState<Ruta | null>(null);

  const handleCloseUpdate = () => {
    setIsOpenUpdate(false);
    setSelectedRuta(null);
  };

  const handleState = async (rutas: Ruta) => {
    await changeState(rutas.id_ruta);
    console.log(rutas.id_ruta);
  };

  const handleAddCentro = async (rutas: Ruta) => {
    try {
      await addRuta(rutas);
      handleClose(); // Cerrar el modal después de darle agregar usuario
    } catch (error) {
      console.error("Error al agregar la ruta:", error);
    }
  };

  const handleEdit = (rutas: Ruta) => {
    setSelectedRuta(rutas);
    setIsOpenUpdate(true);
  };

  // Definir las columnas de la tabla
  const columns: TableColumn<Ruta>[] = [
    { key: "nombre", label: "Nombre" },
    { key: "descripcion", label: "Descripcion" },
    { key: "url_destino", label: "Url" },
    { key: "estado", label: "Estado" },
    { key: "fk_modulo", label: "Modulo" },
  ];

  if (isLoading) {
    return <span>Cargando datos...</span>;
  }

  if (isError) {
    return <span>Error: {error?.message}</span>;
  }

  const rutasWithKey = rutas
    ?.filter((rutas) => rutas?.id_ruta !== undefined)
    .map((rutas) => ({
      ...rutas,
      key: rutas.id_ruta ? rutas.id_ruta.toString() : crypto.randomUUID(),
      estado: Boolean(rutas.estado),
    }));

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">Tabla de Rutas</h1>
      <Modall
        ModalTitle="Agregar Ruta"
        isOpen={isOpen}
        onOpenChange={handleClose}
      >
        <FormRutas
          id="user-form"
          addData={handleAddCentro}
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
        ModalTitle="Editar Ruta"
        isOpen={IsOpenUpdate}
        onOpenChange={handleCloseUpdate}
      >
        {selectedRuta && (
          <FormUpRutas
            rutas={rutasWithKey ?? []}
            rutaId={selectedRuta.id_ruta}
            id="FormUpdate"
            onclose={handleCloseUpdate}
          />
        )}
      </Modall>

      {rutasWithKey && (
        <Globaltable
          data={rutasWithKey}
          columns={columns}
          onEdit={handleEdit}
          onDelete={handleState}
          extraHeaderContent={
            <Buton
              text="Añadir Ruta"
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

export default RutasTable;
