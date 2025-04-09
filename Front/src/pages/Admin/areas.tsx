import Globaltable from "@/components/organismos/table.tsx"; // Importar la tabla reutilizable
import { TableColumn } from "@/components/organismos/table.tsx";
import Buton from "@/components/molecules/Buton";
import Modall from "@/components/molecules/modal";
import Formulario from "@/components/organismos/areas/FormRegister";
import { useState } from "react";
import Formupdate from "@/components/organismos/areas/Formupdate";
import { Chip } from "@heroui/chip"
import { Area } from "@/types/area";
import { useAreas } from "@/hooks/areas/useAreas";



const AreaTable = () => {

    const { areas, isLoading, isError, error, addArea, changeState } = useAreas();

    //Modal agregar
    const [isOpen, setIsOpen] = useState(false);
    const handleClose = () => setIsOpen(false);

    //Modal actualizar
    const [IsOpenUpdate, setIsOpenUpdate] = useState(false);
    const [selectedArea, setSelectedArea] = useState<Area | null>(null);


    const handleCloseUpdate = () => {
        setIsOpenUpdate(false);
        setSelectedArea(null);
    };

    const handleState = async (area: Area) => {
        await changeState(area.id_area);
    }

    const handleAddArea = async (area: Area) => {
        try {
            await addArea(area);
            handleClose(); // Cerrar el modal después de darle agregar usuario
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
        { key: "persona_encargada", label: "persona_encargada" },

        {
            key: "estado",
            label: "estado",
            render: (area: Area) => (
                <Chip
                    className={`px-2 py-1 rounded ${area.estado ? "text-green-500" : " text-red-500" //color texto
                        }`}
                    
                        color={`${area.estado ? "success" : "danger" }`} //color de fondo
                        variant="flat"
                >
                    {area.estado ? "Activo" : "Inactivo"}
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

    const areasWithKey = areas?.filter(area => area?.id_area !== undefined).map((area) => ({
        ...area,
        key: area.id_area ? area.id_area.toString() : crypto.randomUUID(),
        estado: Boolean(area.estado)
    }));


    return (

        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4 text-center">Tabla de Areas</h1>


            <Buton text="Añadir Area" onPress={() => setIsOpen(true)} type="button" color="primary" variant="solid" className="mb-8" />

            <Modall ModalTitle="Agregar Area" isOpen={isOpen} onOpenChange={handleClose}>

                <Formulario id="user-form" addData={handleAddArea} onClose={handleClose} />
                <button type="submit" form="user-form" className="bg-blue-500 text-white p-2 rounded-md">
                    Guardar
                </button>
            </Modall>

            <Modall ModalTitle="Editar Usuario" isOpen={IsOpenUpdate} onOpenChange={handleCloseUpdate}>
                {selectedArea && (
                    <Formupdate areas={areasWithKey ?? []} areaId={selectedArea.id_area} id="FormUpdate" onclose={handleCloseUpdate} />
                )}

            </Modall>

            {areasWithKey && (
                <Globaltable
                    data={areasWithKey}
                    columns={columns}
                    onEdit={handleEdit}
                    onDelete={handleState}

                />

            )}
        </div>
    );
};

export default AreaTable;