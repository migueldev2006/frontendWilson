import Globaltable from "@/components/organismos/table.tsx"; // Importar la tabla reutilizable
import { TableColumn } from "@/components/organismos/table.tsx";
import Buton from "@/components/molecules/Buton";
import Modall from "@/components/molecules/modal";
import Formulario from "@/components/organismos/Programas/FormRegister";
import { useState } from "react";
import Formupdate from "@/components/organismos/Programas/Formupdate";
import { Chip } from "@heroui/chip"
import { Pformacion } from "@/types/programaFormacion";
import { usePrograma } from "@/hooks/programas/usePrograma";



const ProgramasTable = () => {

    const { programas, isLoading, isError, error, addPrograma, changeState } = usePrograma();

    //Modal agregar
    const [isOpen, setIsOpen] = useState(false);
    const handleClose = () => setIsOpen(false);

    //Modal actualizar
    const [IsOpenUpdate, setIsOpenUpdate] = useState(false);
    const [selectedPrograma, setSelectedPrograma] = useState<Pformacion | null>(null);


    const handleCloseUpdate = () => {
        setIsOpenUpdate(false);
        setSelectedPrograma(null);
    };

    const handleState = async (programa: Pformacion) => {
        await changeState(programa.id_programa);
    }

    const handleAddPrograma = async (programa: Pformacion) => {
        try {
            await addPrograma(programa);
            handleClose(); // Cerrar el modal después de darle agregar usuario
        } catch (error) {
            console.error("Error al agregar el programa:", error);
        }
    };


    const handleEdit = (programa: Pformacion) => {
        setSelectedPrograma(programa);
        setIsOpenUpdate(true);
    };





    // Definir las columnas de la tabla
    const columns: TableColumn<Pformacion>[] = [
        { key: "nombre", label: "Nombre" },

        {
            key: "estado",
            label: "estado",
            render: (programa: Pformacion) => (
                <Chip
                    className={`px-2 py-1 rounded ${programa.estado ? "text-green-500" : " text-red-500" //color texto
                        }`}
                    
                        color={`${programa.estado ? "success" : "danger" }`} //color de fondo
                        variant="flat"
                >
                    {programa.estado ? "Activo" : "Inactivo"}
                </Chip>
            ),
        },

    ];

    if (isLoading) {
        return <span>Cargando datos...</span>;
    }

    if (isError) {
        return <span>Error: {error?.message}</span>;
    }

    const usersWithKey = programas?.filter(programa => programa?.id_programa !== undefined).map((programa) => ({
        ...programa,
        key: programa.id_programa ? programa.id_programa.toString() : crypto.randomUUID(),
        estado: Boolean(programa.estado)
    }));


    return (

        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4 text-center">Tabla Programas de Formación</h1>


            <Buton text="Añadir Programa" onPress={() => setIsOpen(true)} type="button" color="primary" variant="solid" className="mb-8" />

            <Modall ModalTitle="Agregar Programa" isOpen={isOpen} onOpenChange={handleClose}>

                <Formulario id="Programa-form" addData={handleAddPrograma} onClose={handleClose} />
                <button type="submit" form="Programa-form" className="bg-blue-500 text-white p-2 rounded-md">
                    Guardar
                </button>
            </Modall>

            <Modall ModalTitle="Editar Usuario" isOpen={IsOpenUpdate} onOpenChange={handleCloseUpdate}>
                {selectedPrograma && (
                    <Formupdate programas={usersWithKey ?? []} programaId={selectedPrograma.id_programa} id="FormUpdate" onclose={handleCloseUpdate} />
                )}

            </Modall>

            {usersWithKey && (
                <Globaltable
                    data={usersWithKey}
                    columns={columns}
                    onEdit={handleEdit}
                    onDelete={handleState}

                />

            )}
        </div>
    );
};

export default ProgramasTable;