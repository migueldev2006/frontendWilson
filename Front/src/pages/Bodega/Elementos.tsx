import Globaltable from "@/components/organismos/table.tsx"; // Importar la tabla reutilizable
import { TableColumn } from "@/components/organismos/table.tsx";
import Buton from "@/components/molecules/Buton";
import Modall from "@/components/molecules/modal";
import { useState } from "react";
import { useElemento } from "@/hooks/Elementos/useElemento";
import { Elemento } from "@/types/Elemento";
import Formulario from "@/components/organismos/Elementos/FormRegister";
import { FormUpdate } from "@/components/organismos/Elementos/FormUpdate";


export const ElementosTable = () => {
  const { elementos, isLoading, isError, error, addElemento, changeState } =
    useElemento();

  //Modal agregar
  const [isOpen, setIsOpen] = useState(false);
  const handleClose = () => setIsOpen(false);

  //Modal actualizar
  const [IsOpenUpdate, setIsOpenUpdate] = useState(false);
  const [selectedElemento, setSelectedElemento] = useState<Elemento | null>(
    null
  );

  const handleCloseUpdate = () => {
    setIsOpenUpdate(false);
    setSelectedElemento(null);
  };

  const handleState = async (elemento: Elemento) => {
    await changeState(elemento.id_elemento);
  };

  const handleAddElemento = async (elemento: Elemento) => {
    try {
      await addElemento(elemento);
      handleClose(); // Cerrar el modal después de darle agregar usuario
    } catch (error) {
      console.error("Error al agregar el usuario:", error);
    }
  };

  const handleEdit = (elemento: Elemento) => {
    setSelectedElemento(elemento);
    setIsOpenUpdate(true);
  };

  // Definir las columnas de la tabla
  const columns: TableColumn<Elemento>[] = [
    {
      label:"Imagen",
      key: 'imagen_elemento',
      render: (item: Elemento) => {
        return item.imagen_elemento ? (
          <img src={`http://localhost:3000/img/${item.imagen_elemento}`} alt="Imagen" width={200} height={50} />
        ) : (
          <span>Sin imagen</span>
        );
      },
    },
    { key: "nombre", label: "Nombre" },
    { key: "descripcion", label: "Descripcion" },
    { key: "valor", label: "Valor" },
    { key: "tipo_elemento", label: "Tipo Elemento",
      render:(elementos:Elemento) => (
        <span>
        {elementos.perecedero
          ? "Perecedero"
          :elementos.no_perecedero
          ? "No Perecedero"
          :"No Especificado"
        }</span>
      ),
     },
    {
      key: "created_at",
      label: "Fecha Creación",
      render: (rol: Elemento) => (
        <span>
          {new Date(rol.created_at).toLocaleDateString("es-ES", {
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
      render: (rol: Elemento) => (
        <span>
          {new Date(rol.updated_at).toLocaleDateString("es-ES", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          })}
        </span>
      ),
    },
    { key: "estado", label: "Estado"},
  ];

  if (isLoading) {
    return <span>Cargando datos...</span>;
  }

  if (isError) {
    return <span>Error: {error?.message}</span>;
  }

  const ElementosWithKey = elementos
    ?.filter((elemento) => elemento?.id_elemento !== undefined)
    .map((elemento) => ({
      ...elemento,
      key: elemento.id_elemento
        ? elemento.id_elemento.toString()
        : crypto.randomUUID(),
      estado: Boolean(elemento.estado),
    }));

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">
        Elementos Registrados
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
        ModalTitle="Registrar Nuevo Elemento"
        isOpen={isOpen}
        onOpenChange={handleClose}
      >
        <Formulario
          id="element-form"
          addData={handleAddElemento}
          onClose={handleClose}
        />
        <button
          type="submit"
          form="element-form"
          className="bg-blue-500 text-white p-2 rounded-md"
        >
          Guardar
        </button>
      </Modall>

      <Modall
        ModalTitle="Editar Elemento"
        isOpen={IsOpenUpdate}
        onOpenChange={handleCloseUpdate}
      >
        {selectedElemento && (
          <FormUpdate
            elementos={ElementosWithKey ?? []}
            elementoId={selectedElemento.id_elemento}
            id="FormUpdate"
            onclose={handleCloseUpdate}
          />
        )}
      </Modall>

      {ElementosWithKey && (
        <Globaltable
          data={ElementosWithKey}
          columns={columns}
          onEdit={handleEdit}
          onDelete={handleState}
        />
      )}
    </div>
  );
};
