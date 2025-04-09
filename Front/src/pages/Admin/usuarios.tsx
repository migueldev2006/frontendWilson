import Globaltable from "@/components/organismos/table.tsx"; // Importar la tabla reutilizable
import { TableColumn } from "@/components/organismos/table.tsx";
import Buton from "@/components/molecules/Buton";
import Modall from "@/components/molecules/modal";
import Formulario from "@/components/organismos/Usuarios/FormRegister";
import { useState } from "react";
import Formupdate from "@/components/organismos/Usuarios/Formupdate";
import { Chip } from "@heroui/chip"
import { User } from "@/types/Usuario";
import { useUsuario } from "@/hooks/Usuarios/useUsuario";



const UsersTable = () => {

    const { users, isLoading, isError, error, addUser, changeState } = useUsuario();

    //Modal agregar
    const [isOpen, setIsOpen] = useState(false);
    const handleClose = () => setIsOpen(false);

    //Modal actualizar
    const [IsOpenUpdate, setIsOpenUpdate] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);


    const handleCloseUpdate = () => {
        setIsOpenUpdate(false);
        setSelectedUser(null);
    };

    const handleState = async (user: User) => {
        await changeState(user.id_usuario);
    }

    const handleAddUser = async (user: User) => {
        try {
            await addUser(user);
            handleClose(); // Cerrar el modal después de darle agregar usuario
        } catch (error) {
            console.error("Error al agregar el usuario:", error);
        }
    };


    const handleEdit = (user: User) => {
        setSelectedUser(user);
        setIsOpenUpdate(true);
    };





    // Definir las columnas de la tabla
    const columns: TableColumn<User>[] = [
        { key: "nombre", label: "Nombre" },
        { key: "apellido", label: "Apellido" },
        { key: "edad", label: "edad" },
        { key: "telefono", label: "telefono" },
        { key: "correo", label: "Correo" },
        { key: "cargo", label: "Cargo" },
        {
            key: "estado",
            label: "estado",
            render: (user: User) => (
                <Chip
                    className={`px-2 py-1 rounded ${user.estado ? "text-green-500" : " text-red-500" //color texto
                        }`}
                    
                        color={`${user.estado ? "success" : "danger" }`} //color de fondo
                        variant="flat"
                >
                    {user.estado ? "Activo" : "Inactivo"}
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

    const usersWithKey = users?.filter(user => user?.id_usuario !== undefined).map((user) => ({
        ...user,
        key: user.id_usuario ? user.id_usuario.toString() : crypto.randomUUID(),
        estado: Boolean(user.estado)
    }));


    return (

        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4 text-center">Tabla de Usuarios</h1>


            <Buton text="Añadir Usuario" onPress={() => setIsOpen(true)} type="button" color="primary" variant="solid" className="mb-8" />

            <Modall ModalTitle="Agregar Usuario" isOpen={isOpen} onOpenChange={handleClose}>

                <Formulario id="user-form" addData={handleAddUser} onClose={handleClose} />
                <button type="submit" form="user-form" className="bg-blue-500 text-white p-2 rounded-md">
                    Guardar
                </button>
            </Modall>

            <Modall ModalTitle="Editar Usuario" isOpen={IsOpenUpdate} onOpenChange={handleCloseUpdate}>
                {selectedUser && (
                    <Formupdate users={usersWithKey ?? []} userId={selectedUser.id_usuario} id="FormUpdate" onclose={handleCloseUpdate} />
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

export default UsersTable;