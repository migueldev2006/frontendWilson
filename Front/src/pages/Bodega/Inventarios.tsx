import Globaltable from "@/components/organismos/table.tsx"; // Importar la tabla reutilizable
import { TableColumn } from "@/components/organismos/table.tsx";
import Buton from "@/components/molecules/Buton";
import Modall from "@/components/molecules/modal";
import { useState } from "react";
import { Chip } from "@heroui/chip"
import Formulario from "@/components/organismos/Inventarios/FormRegister";
import { useInventario } from "@/hooks/Inventarios/useInventario";
import { Inventario } from "@/types/Inventario";
import { FormUpdate } from "@/components/organismos/Inventarios/FormUpdate";


export const InventariosTable = () => {

    const { inventarios, isLoading, isError, error, addInventario, changeState } = useInventario();

    //Modal agregar
    const [isOpen, setIsOpen] = useState(false);
    const handleClose = () => setIsOpen(false);

    //Modal actualizar
    const [IsOpenUpdate, setIsOpenUpdate] = useState(false);
    const [selectedInventario, setSelectedInventario] = useState<Inventario | null>(null);


    const handleCloseUpdate = () => {
        setIsOpenUpdate(false);
        setSelectedInventario(null);
    };

    const handleState = async (inventario: Inventario) => {
        await changeState(inventario.id_inventario);
    }

    const handleAddInventario = async (inventario: Inventario) => {
        try {
            await addInventario(inventario);
            handleClose(); // Cerrar el modal después de darle agregar usuario
        } catch (error) {
            console.error("Error al agregar el usuario:", error);
        }
    };


    const handleEdit = (inventario: Inventario) => {
        setSelectedInventario(inventario);
        setIsOpenUpdate(true);
    };

    // Definir las columnas de la tabla
    const columns: TableColumn<Inventario>[] = [
        { key: "stock", label: "Cantidad" },
        {
            key: "estado",
            label: "estado",
            render: (inventario: Inventario) => (
                <Chip
                    className={`px-2 py-1 rounded ${inventario.estado ? "text-green-500" : " text-red-500" //color texto
                        }`}
                    
                        color={`${inventario.estado ? "success" : "danger" }`} //color de fondo
                        variant="flat"
                >
                    {inventario.estado ? "Activo" : "Inactivo"}
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

    const InventariosWithKey = inventarios?.filter(inventario => inventario?.id_inventario !== undefined).map((inventario) => ({
        ...inventario,
        key: inventario.id_inventario ? inventario.id_inventario.toString() : crypto.randomUUID(),
        estado: Boolean(inventario.estado)
    }));


    return (

        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4 text-center">Inventarios Registrados</h1>


            <Buton text="Nuevo inventario" onPress={() => setIsOpen(true)} type="button" color="primary" variant="solid" className="mb-8" />

            <Modall ModalTitle="Registrar Nuevo Inventario" isOpen={isOpen} onOpenChange={handleClose}>

                <Formulario id="element-form" addData={handleAddInventario} onClose={handleClose} />
                <button type="submit" form="user-form" className="bg-blue-500 text-white p-2 rounded-md">
                    Guardar
                </button>
            </Modall>

            <Modall ModalTitle="Editar Usuario" isOpen={IsOpenUpdate} onOpenChange={handleCloseUpdate}>
                {selectedInventario && (
                    <FormUpdate inventarios={InventariosWithKey ?? []} inventarioId={selectedInventario.id_inventario} id="FormUpdate" onclose={handleCloseUpdate} />
                )}

            </Modall>

            {InventariosWithKey && (
                <Globaltable
                    data={InventariosWithKey}
                    columns={columns}
                    onEdit={handleEdit}
                    onDelete={handleState}

                />

            )}
        </div>
    );
};
