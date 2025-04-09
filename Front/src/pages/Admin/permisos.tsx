import Globaltable from "@/components/organismos/table.tsx"; // Importar la tabla reutilizable
import { TableColumn } from "@/components/organismos/table.tsx";
import Buton from "@/components/molecules/Buton";
import Modall from "@/components/molecules/modal";
import Formulario from "@/components/organismos/permisos/FormRegister";
import { useState } from "react";
import Formupdate from "@/components/organismos/permisos/Formupdate";
// import { Chip } from "@heroui/chip"
import { Permisos } from "@/types/permisos";
import { usePermisos } from "@/hooks/permisos/usePermisos";



const PermisoTable = () => {

    const { permiso, isLoading, isError, error, addPermiso } = usePermisos();

    //Modal agregar
    const [isOpen, setIsOpen] = useState(false);
    const handleClose = () => setIsOpen(false);

    //Modal actualizar
    const [IsOpenUpdate, setIsOpenUpdate] = useState(false);
    const [selectedPermisos, setSelectedPermiso] = useState<Permisos | null>(null);


    const handleCloseUpdate = () => {
        setIsOpenUpdate(false);
        setSelectedPermiso(null);
    };

    // const handleState = async (user: Permisos) => {
    //     await changeState(user.id_permiso);
    // }

    const handleAddUser = async (permiso: Permisos) => {
        try {
            await addPermiso(permiso);
            handleClose(); // Cerrar el modal después de darle agregar usuario
        } catch (error) {
            console.error("Error al agregar el permiso:", error);
        }
    };


    const handleEdit = (permiso: Permisos) => {
        setSelectedPermiso(permiso);
        setIsOpenUpdate(true);
    };





    // Definir las columnas de la tabla
    const columns: TableColumn<Permisos>[] = [
        { key: "permiso", label: "permiso" },

       

    ];

    if (isLoading) {
        return <span>Cargando datos...</span>;
    }

    if (isError) {
        return <span>Error: {error?.message}</span>;
    }

    const PermisoWithKey = permiso?.filter(permiso => permiso?.id_permiso !== undefined).map((permiso) => ({
        ...permiso,
        key: permiso.id_permiso ? permiso.id_permiso.toString() : crypto.randomUUID(),
        estado: Boolean(permiso.id_permiso)
    }));


    return (

        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4 text-center">Tabla de Permiso</h1>


            <Buton text="Añadir permiso" onPress={() => setIsOpen(true)} type="button" color="primary" variant="solid" className="mb-8" />

            <Modall ModalTitle="Agregar permiso" isOpen={isOpen} onOpenChange={handleClose}>

                <Formulario id="permiso-form" addData={handleAddUser} onClose={handleClose} />
                <button type="submit" form="permiso-form" className="bg-blue-500 text-white p-2 rounded-md">
                    Guardar
                </button>
            </Modall>

            <Modall ModalTitle="Editar permiso" isOpen={IsOpenUpdate} onOpenChange={handleCloseUpdate}>
                {selectedPermisos && (
                    <Formupdate permiso={PermisoWithKey ?? []} permsoId={selectedPermisos.id_permiso} id="FormUpdate" onclose={handleCloseUpdate} />
                )}

            </Modall>

            {PermisoWithKey && (
                <Globaltable
                    data={PermisoWithKey}
                    columns={columns}
                    onEdit={handleEdit}
                    onDelete={()=>{}}

                />

            )}
        </div>
    );
};

export default PermisoTable;