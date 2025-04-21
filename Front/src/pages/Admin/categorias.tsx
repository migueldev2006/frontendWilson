import Globaltable from "@/components/organismos/table.tsx"; // Importar la tabla reutilizable
import { TableColumn } from "@/components/organismos/table.tsx";
import Buton from "@/components/molecules/Buton";
import Modall from "@/components/molecules/modal";
import FormCategorias from "@/components/organismos/Categorias/FormCategorias";
import { useState } from "react";
import FormUpCategoria from "@/components/organismos/Categorias/FormUpCategoria";
import { Categoria } from "@/types/Categorias";
import { useCategoria } from "@/hooks/Categorias/useCategorias";



const CategoriasTable = () => {

    const { categorias, isLoading, isError, error, addCategoria, changeState } = useCategoria();

    //Modal agregar
    const [isOpen, setIsOpen] = useState(false);
    const handleClose = () => setIsOpen(false);

    //Modal actualizar
    const [IsOpenUpdate, setIsOpenUpdate] = useState(false);
    const [selectedCategoria, setSelectedCategoria] = useState<Categoria | null>(null);


    const handleCloseUpdate = () => {
        setIsOpenUpdate(false);
        setSelectedCategoria(null);
    };

    const handleState = async (categorias: Categoria) => {
        await changeState(categorias.id_categoria);
        console.log(categorias.id_categoria)
    }

    const handleAddCategoria = async (categoria: Categoria) => {
        try {
            await addCategoria(categoria);
            handleClose(); // Cerrar el modal después de darle agregar usuario
        } catch (error) {
            console.error("Error al agregar la categoria:", error);
        }
    };


    const handleEdit = (categoria: Categoria) => {
        setSelectedCategoria(categoria);
        setIsOpenUpdate(true);
    };

    // Definir las columnas de la tabla
    const columns: TableColumn<Categoria>[] = [
        { key: "nombre", label: "Nombre" },
        {key: "estado",label: "estado" }];

    if (isLoading) {
        return <span>Cargando datos...</span>;
    }

    if (isError) {
        return <span>Error: {error?.message}</span>;
    }

    const categoriasWithKey = categorias?.filter(categorias => categorias?.id_categoria !== undefined).map((categorias) => ({
        ...categorias,
        key: categorias.id_categoria ? categorias.id_categoria.toString() : crypto.randomUUID(),
        estado: Boolean(categorias.estado)
    }));


    return (

        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4 text-center">Tabla de Categorias</h1>
            <Buton text="Añadir Categoria" onPress={() => setIsOpen(true)} type="button" color="primary" variant="solid" className="mb-8" />

             <Modall ModalTitle="Agregar Categoria" isOpen={isOpen} onOpenChange={handleClose}>

                <FormCategorias id="categoria-form" addData={handleAddCategoria} onClose={handleClose} />
                <button type="submit" form="categoria-form" className="bg-blue-500 text-white p-2 rounded-md">
                    Guardar
                </button>
            </Modall>

            <Modall ModalTitle="Editar Categoria" isOpen={IsOpenUpdate} onOpenChange={handleCloseUpdate}>
                {selectedCategoria && (
                    <FormUpCategoria categorias={categoriasWithKey ?? []} categoriaId={selectedCategoria.id_categoria} id="FormUpdate" onclose={handleCloseUpdate} />
                )}

            </Modall>

            {categoriasWithKey && (
                <Globaltable
                    data={categoriasWithKey}
                    columns={columns}
                    onEdit={handleEdit}
                    onDelete={handleState}

                />

            )}
        </div>
    );
};

export default CategoriasTable;