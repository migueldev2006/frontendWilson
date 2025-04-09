import Globaltable from "@/components/organismos/table.tsx"; // Importar la tabla reutilizable
import { TableColumn } from "@/components/organismos/table.tsx";
import Buton from "@/components/molecules/Buton";
import Modall from "@/components/molecules/modal";
import Formulario from "@/components/organismos/RolModulo/FormRegister";
import { useState } from "react";
import Formupdate from "@/components/organismos/RolModulo/Formupdate";
// import { Chip } from "@heroui/chip"
import { RolModulo } from "@/types/rolModulo";
import { useRolModulo } from "@/hooks/rolModulo/useRolModulo";



const RolModuloTable = () => {

    const { programas, isLoading, isError, error, addRolModulo } = useRolModulo();

    //Modal agregar
    const [isOpen, setIsOpen] = useState(false);
    const handleClose = () => setIsOpen(false);

    //Modal actualizar
    const [IsOpenUpdate, setIsOpenUpdate] = useState(false);
    const [selectedRolModulo, setSelectedRolModulo] = useState<RolModulo | null>(null);


    const handleCloseUpdate = () => {
        setIsOpenUpdate(false);
        setSelectedRolModulo(null);
    };

    // const handleState = async (user: User) => {
    //     await changeState(user.id_usuario);
    // }

    const handleAddRolMOdulo = async (RolModulo: RolModulo) => {
        try {
            await addRolModulo(RolModulo);
            handleClose(); // Cerrar el modal después de darle agregar usuario
        } catch (error) {
            console.error("Error al agregar  RolModulo:", error);
        }
    };


    const handleEdit = (RolModulo: RolModulo) => {
        setSelectedRolModulo(RolModulo);
        setIsOpenUpdate(true);
    };





    // Definir las columnas de la tabla
    const columns: TableColumn<RolModulo>[] = [
        { key: "fk_rol", label: "fk_rol" },
        { key: "fk_modulo", label: "fk_modulo" },
        { key: "fk_permiso", label: "fk_permiso" },

        // {
        //     key: "estado",
        //     label: "estado",
        //     render: (user: RolModulo) => (
        //         <Chip
        //             className={`px-2 py-1 rounded ${user.estado ? "text-green-500" : " text-red-500" //color texto
        //                 }`}
                    
        //                 color={`${user.estado ? "success" : "danger" }`} //color de fondo
        //                 variant="flat"
        //         >
        //             {user.estado ? "Activo" : "Inactivo"}
        //         </Chip>
        //     ),
        // },

    ];

    if (isLoading) {
        return <span>Cargando datos...</span>;
    }

    if (isError) {
        return <span>Error: {error?.message}</span>;
    }

    const RolModuloWithKey = programas?.filter(RolModulo => RolModulo?.id_rol_modulo !== undefined).map((RolModulo) => ({
        ...RolModulo,
        key: RolModulo.id_rol_modulo ? RolModulo.id_rol_modulo.toString() : crypto.randomUUID(),
        estado: Boolean(RolModulo.id_rol_modulo)
    }));


    return (

        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4 text-center">Tabla  Rol_Modulo</h1>


            <Buton text="Añadir RolModulo" onPress={() => setIsOpen(true)} type="button" color="primary" variant="solid" className="mb-8" />

            <Modall ModalTitle="Agregar RolModulo" isOpen={isOpen} onOpenChange={handleClose}>

                <Formulario id="RolModulo-form" addData={handleAddRolMOdulo} onClose={handleClose} />
                <button type="submit" form="user-form" className="bg-blue-500 text-white p-2 rounded-md">
                    Guardar
                </button>
            </Modall>

            <Modall ModalTitle="Editar RolModulo" isOpen={IsOpenUpdate} onOpenChange={handleCloseUpdate}>
                {selectedRolModulo && (
                    <Formupdate rolModulos={RolModuloWithKey ?? []} rolModuloId={selectedRolModulo.id_rol_modulo} id="FormUpdate" onclose={handleCloseUpdate} />
                )}

            </Modall>

            {RolModuloWithKey && (
                <Globaltable
                    data={RolModuloWithKey}
                    columns={columns}
                    onEdit={handleEdit}
                    onDelete={() => {}}

                />

            )}
        </div>
    );
};

export default RolModuloTable;