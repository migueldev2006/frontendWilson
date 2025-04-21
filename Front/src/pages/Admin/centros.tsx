import Globaltable from "@/components/organismos/table.tsx"; // Importar la tabla reutilizable
import { TableColumn } from "@/components/organismos/table.tsx";
import Buton from "@/components/molecules/Buton";
import Modall from "@/components/molecules/modal";
import FormCentros from "@/components/organismos/Centros/FormCentros";
import { useState } from "react";
import FormUpCentro from "@/components/organismos/Centros/FormUpCentro";
import { Centro } from "@/schemas/Centro";
import { useCentro } from "@/hooks/Centros/useCentros";



const CentrosTable = () => {

    const { centros, isLoading, isError, error, addCentro, changeState } = useCentro();

    //Modal agregar
    const [isOpen, setIsOpen] = useState(false);
    const handleClose = () => setIsOpen(false);

    //Modal actualizar
    const [IsOpenUpdate, setIsOpenUpdate] = useState(false);
    const [selectedUser, setSelectedUser] = useState<Centro | null>(null);


    const handleCloseUpdate = () => {
        setIsOpenUpdate(false);
        setSelectedUser(null);
    };

    const handleState = async (centros: Centro) => {
        await changeState(centros.id_centro as number);
        console.log(centros.id_centro)
    }

    const handleAddCentro = async (centros: Centro) => {
        try {
            await addCentro(centros);
            handleClose(); // Cerrar el modal después de darle agregar usuario
        } catch (error) {
            console.error("Error al agregar el centro:", error);
        }
    };


    const handleEdit = (centros: Centro) => {
        setSelectedUser(centros);
        setIsOpenUpdate(true);
    };

    // Definir las columnas de la tabla
    const columns: TableColumn<Centro>[] = [
        { key: "nombre", label: "Nombre" },
        {key: "estado",label: "estado" },
        {key: "fk_municipio",label: "municipio" },];

    if (isLoading) {
        return <span>Cargando datos...</span>;
    }

    if (isError) {
        return <span>Error: {error?.message}</span>;
    }

    const centrosWithKey = centros?.filter(centros => centros?.id_centro !== undefined).map((centros) => ({
        ...centros,
        key: centros.id_centro ? centros.id_centro.toString() : crypto.randomUUID(),
        id_centro : centros.id_centro as number,
        estado: Boolean(centros.estado)
    }));


    return (

        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4 text-center">Tabla de Centros</h1>
            <Buton text="Añadir Centro" onPress={() => setIsOpen(true)} type="button" color="primary" variant="solid" className="mb-8" />

             <Modall ModalTitle="Agregar centro" isOpen={isOpen} onOpenChange={handleClose}>

                <FormCentros id="user-form" addData={handleAddCentro} onClose={handleClose} />
                <button type="submit" form="user-form" className="bg-blue-500 text-white p-2 rounded-md">
                    Guardar
                </button>
            </Modall>

            <Modall ModalTitle="Editar Usuario" isOpen={IsOpenUpdate} onOpenChange={handleCloseUpdate}>
                {selectedUser && (
                    <FormUpCentro centros={centrosWithKey ?? []} centroId={selectedUser.id_centro as number} id="FormUpdate" onclose={handleCloseUpdate} />
                )}

            </Modall>

            {centrosWithKey && (
                <Globaltable
                    data={centrosWithKey}
                    columns={columns}
                    onEdit={handleEdit}
                    onDelete={handleState}

                />

            )}
        </div>
    );
};

export default CentrosTable;