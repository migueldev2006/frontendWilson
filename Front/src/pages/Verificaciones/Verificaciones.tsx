import Globaltable from "@/components/organismos/table.tsx"; // Importar la tabla reutilizable
import { TableColumn } from "@/components/organismos/table.tsx";
import Buton from "@/components/molecules/Buton";
import Modall from "@/components/molecules/modal";
import { useState } from "react";
import { useVerificacion } from "@/hooks/Verificaciones/useVerificacion";
import { Verificacion } from "@/types/Verificacion";
import Formulario from "@/components/organismos/Verificaciones/FormRegister";
import { FormUpdate } from "@/components/organismos/Verificaciones/FormUpdate";
import { useSitios } from "@/hooks/sitios/useSitios";

export const VerificacionTable = () => {
  const { verificaciones, isLoading, isError, error, addVerificacion,  } =
    useVerificacion();

    const {sitios: sitios} = useSitios()
  //Modal agregar
  const [isOpen, setIsOpen] = useState(false);
  const handleClose = () => setIsOpen(false);

  //Modal actualizar
  const [IsOpenUpdate, setIsOpenUpdate] = useState(false);
  const [selectedVerificacion, setSelectedVerificacion] = useState<Verificacion | null>(
    null
  );

  const handleCloseUpdate = () => {
    setIsOpenUpdate(false);
    setSelectedVerificacion(null);
  };

  const handleAddVerificacion = async (verifiacion: Verificacion) => {
    try {
      await addVerificacion(verifiacion);
      handleClose(); // Cerrar el modal después de darle agregar usuario
    } catch (error) {
      console.error("Error al agregar la verifiacion:", error);
    }
  };

  const handleEdit = (verifiacion: Verificacion) => {
    setSelectedVerificacion(verifiacion);
    setIsOpenUpdate(true);
  };

  // Definir las columnas de la tabla
  const columns: TableColumn<Verificacion>[] = [
    { key: "persona_encargada", label: "Encargado" },
    { key: "persona_asignada", label: "Solicitante" },
    { key: "hora_ingreso", label: "Ingreso" },
    { key: "hora_salida", label: "Salida" },
    { key: "fk_sitio", label: "Sitio",       
      render: (verifiacion: Verificacion) => {
            const sitio = sitios?.find(
              (si) => si.id_sitio === verifiacion.fk_sitio
            );
            return <span>{sitio?.nombre ?? "No encontrado"}</span>;
          },},
    {
      key: "created_at",
      label: "Fecha Verificacion",
      render: (verificacion: Verificacion) => (
        <span>{new Date(verificacion.created_at).toLocaleDateString("es-ES")}</span>
      ),
    },
    {
      key: "updated_at",
      label: "Fecha Actualización",
      render: (verificacion: Verificacion) => (
        <span>{new Date(verificacion.updated_at).toLocaleDateString("es-ES")}</span>
      ),
    },
  ];

  if (isLoading) {
    return <span>Cargando datos...</span>;
  }

  if (isError) {
    return <span>Error: {error?.message}</span>;
  }

  const VerificacionsWithKey = verificaciones
    ?.filter((elemento) => elemento?.id_verificacion !== undefined)
    .map((elemento) => ({
      ...elemento,
      key: elemento.id_verificacion
        ? elemento.id_verificacion.toString()
        : crypto.randomUUID(),
    }));

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">
        Verificaciones Registradas
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
        ModalTitle="Registrar Nuevo Verificacion"
        isOpen={isOpen}
        onOpenChange={handleClose}
      >
        <Formulario
          id="element-form"
          addData={handleAddVerificacion}
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
        {selectedVerificacion && (
          <FormUpdate
            verificaciones={VerificacionsWithKey ?? []}
            verificacionId={selectedVerificacion.id_verificacion}
            id="FormUpdate"
            onclose={handleCloseUpdate}
          />
        )}
      </Modall>

      {VerificacionsWithKey && (
        <Globaltable
          data={VerificacionsWithKey}
          columns={columns}
          onEdit={handleEdit}
          onDelete={() => {}}
        />
      )}
    </div>
  );
};
