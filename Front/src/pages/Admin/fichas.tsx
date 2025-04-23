import Globaltable from "@/components/organismos/table.tsx"; // Importar la tabla reutilizable
import { TableColumn } from "@/components/organismos/table.tsx";
import Buton from "@/components/molecules/Buton";
import Modall from "@/components/molecules/modal";
import Formulario from "@/components/organismos/fichas/FormRegister";
import { useState } from "react";
import Formupdate from "@/components/organismos/fichas/Formupdate";
import { Chip } from "@heroui/chip"
import { Ficha } from "@/types/Ficha";
import { useFichas } from "@/hooks/fichas/useFichas";



const FcihasTable = () => {

    const { fichas, isLoading, isError, error, addFicha, changeState } = useFichas();

    //Modal agregar
    const [isOpen, setIsOpen] = useState(false);
    const handleClose = () => setIsOpen(false);

    //Modal actualizar
    const [IsOpenUpdate, setIsOpenUpdate] = useState(false);
    const [selectedFicha, setSelectedFicha] = useState<Ficha | null>(null);


    const handleCloseUpdate = () => {
        setIsOpenUpdate(false);
        setSelectedFicha(null);
    };

    const handleState = async (ficha: Ficha) => {
        await changeState(ficha.id_ficha);
    }

    const handleAddficha = async (ficha: Ficha) => {
        try {
            await addFicha(ficha);
            handleClose(); 
        } catch (error) {
            console.error("Error al agregar la ficha:", error);
        }
    };


    const handleEdit = (ficha: Ficha) => {
        setSelectedFicha(ficha);
        setIsOpenUpdate(true);
    };





    // Definir las columnas de la tabla
    const columns: TableColumn<Ficha>[] = [
        { key: "codigo_ficha", label: "codigo ficha" },
        { key: "estado", label: "Estado" },
        { key: "created_at", label: "fecha de creacion" },
        { key: "updated_at", label: "fecha de actualizacion" }
      

    ];

    if (isLoading) {
        return <span>Cargando datos...</span>;
    }

    if (isError) {
        return <span>Error: {error?.message}</span>;
    }

    const fichasWithKey = fichas?.filter(ficha => ficha?.id_ficha !== undefined).map((ficha) => ({
        ...ficha,
        key: ficha.id_ficha ? ficha.id_ficha.toString() : crypto.randomUUID(),
        estado: Boolean(ficha.estado)
    }));


    return (

        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4 text-center">Tabla de fichas</h1>


            <Buton text="Añadir ficha" onPress={() => setIsOpen(true)} type="button" color="primary" variant="solid" className="mb-8" />

            <Modall ModalTitle="Agregar ficha" isOpen={isOpen} onOpenChange={handleClose}>

                <Formulario id="user-form" addData={handleAddficha} onClose={handleClose} />
                <button type="submit" form="user-form" className="bg-blue-500 text-white p-2 rounded-md">
                    Guardar
                </button>
            </Modall>

            <Modall ModalTitle="Editar ficha" isOpen={IsOpenUpdate} onOpenChange={handleCloseUpdate}>
                {selectedFicha && (
                    <Formupdate Fichas={fichasWithKey ?? []} fichasId={selectedFicha.id_ficha} id="FormUpdate" onclose={handleCloseUpdate} />
                )}

            </Modall>

            {fichasWithKey && (
                <Globaltable
                    data={fichasWithKey}
                    columns={columns}
                    onEdit={handleEdit}
                    onDelete={handleState}

                />

            )}
        </div>
    );
};

export default FcihasTable;