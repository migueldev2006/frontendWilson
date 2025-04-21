import Globaltable from "@/components/organismos/table.tsx"; // Importar la tabla reutilizable
import { TableColumn } from "@/components/organismos/table.tsx";
import Buton from "@/components/molecules/Buton";
import Modall from "@/components/molecules/modal";
import FormMunicipios from "@/components/organismos/Municipio/FormMunicipios";
import { useState } from "react";
import FormUpMunicipio from "@/components/organismos/Municipio/FormUpMunicipio";
import { Municipio } from "@/types/Municipio";
import { useMunicipio } from "@/hooks/Municipio/useMunicipio";



const MunicipiosTable = () => {

    const { municipios, isLoading, isError, error, addMunicipio, changeState } = useMunicipio();

    //Modal agregar
    const [isOpen, setIsOpen] = useState(false);
    const handleClose = () => setIsOpen(false);

    //Modal actualizar
    const [IsOpenUpdate, setIsOpenUpdate] = useState(false);
    const [selectedMunicipio, setSelectedMunicipio] = useState<Municipio | null>(null);


    const handleCloseUpdate = () => {
        setIsOpenUpdate(false);
        setSelectedMunicipio(null);
    };

    const handleState = async (municipios: Municipio) => {
        await changeState(municipios.id_municipio);
        console.log(municipios.id_municipio)
    }

    const handleAddMunicipio = async (municipios: Municipio) => {
        try {
            await addMunicipio(municipios);
            handleClose(); // Cerrar el modal después de darle agregar usuario
        } catch (error) {
            console.error("Error al agregar el municipio:", error);
        }
    };


    const handleEdit = (municipios: Municipio) => {
        setSelectedMunicipio(municipios);
        setIsOpenUpdate(true);
    };

    // Definir las columnas de la tabla
    const columns: TableColumn<Municipio>[] = [
        { key: "nombre", label: "Nombre" },
        { key: "departamento", label: "Departamento" },
        {key: "estado",label: "estado" },
        ];

    if (isLoading) {
        return <span>Cargando datos...</span>;
    }

    if (isError) {
        return <span>Error: {error?.message}</span>;
    }

    const municipiosWithKey = municipios?.filter(municipios => municipios?.id_municipio !== undefined).map((municipios) => ({
        ...municipios,
        key: municipios.id_municipio ? municipios.id_municipio.toString() : crypto.randomUUID(),
        estado: Boolean(municipios.estado)
    }));


    return (

        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4 text-center">Tabla de Municipios</h1>
            <Buton text="Añadir Municipio" onPress={() => setIsOpen(true)} type="button" color="primary" variant="solid" className="mb-8" />

             <Modall ModalTitle="Agregar municipio" isOpen={isOpen} onOpenChange={handleClose}>

                <FormMunicipios id="municipio-form" addData={handleAddMunicipio} onClose={handleClose} />
                <button type="submit" form="municipio-form" className="bg-blue-500 text-white p-2 rounded-md"> 
                    Guardar
                </button>
            </Modall>

            <Modall ModalTitle="Editar Municipio" isOpen={IsOpenUpdate} onOpenChange={handleCloseUpdate}>
                {selectedMunicipio && (
                    <FormUpMunicipio municipios={municipiosWithKey ?? []} municipioId={selectedMunicipio.id_municipio} id="FormUpMuni" onclose={handleCloseUpdate} />
                )}

            </Modall>

            {municipiosWithKey && (
                <Globaltable
                    data={municipiosWithKey}
                    columns={columns}
                    onEdit={handleEdit}
                    onDelete={handleState}

                />

            )}
        </div>
    );
};

export default MunicipiosTable;