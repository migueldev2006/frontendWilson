import React, { useState, useEffect } from "react";
import { Form } from "@heroui/form"
import Inpu from "@/components/molecules/input";
import { useMovimiento } from "@/hooks/Movimientos/useMovimiento";
import { Movimiento } from "@/types/Movimiento";

type Props = {
    movimientos: Movimiento[] ;
    movimientoId: number;
    id: string
    onclose: () => void;

}

export const FormUpdate = ({ movimientos, movimientoId, id, onclose }: Props) => {
    const [formData, setFormData] = useState<Partial<Movimiento>>({
        id_movimiento: 0,
        descripcion: "",
        cantidad: 0,
        hora_ingreso: "",
        hora_salida: "",
        aceptado: true,
        en_proceso: false,
        cancelado: false,
        devolutivo: true,
        no_devolutivo: false,
        fk_usuario: 0,
        fk_tipo_movimiento: 0,
        fk_sitio: 0,
        fk_inventario: 0,
    });

    const {updateMovimiento, getMovimientoById} = useMovimiento()

    useEffect(() => { // se ejecuta cuando algo se cambie en un usuario, obtiene el id y modifica el FormData
        const foundMovimiento = getMovimientoById(movimientoId);

        if (foundMovimiento) {
            setFormData(foundMovimiento);
        }

    }, [movimientos, movimientoId]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => { //se ejecuta cuando el usuario cambia algo en un campo
        const { name, value, type, checked } = e.target;

        setFormData((prev : Partial<Movimiento>) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };


    const handleSubmit = async (e : React.FormEvent) => {

        e.preventDefault();
        if (!formData.id_movimiento) {
            return <p className="text-center text-gray-500">Usuario no encontrado</p>;
        }
        
        try {
            await updateMovimiento(formData.id_movimiento, formData);
            onclose();
        } catch (error) {
            console.log("Error al actualizar el usuario", error);
        }
    }




    return (
        <Form id={id} className="w-full space-y-4" onSubmit={handleSubmit}>
            <Inpu label="Descripcion" placeholder="Descripcion" type="text" name="descripcion" value={formData.descripcion ?? ''} onChange={handleChange} />
            <Inpu label="Cantidad" placeholder="Cantidad" type="number" name="cantidad" value={String(formData.cantidad) ?? ''} onChange={handleChange} />
            <Inpu label="Hora Ingreso" placeholder="Hora Ingreso" type="time" name="hora_ingreso" value={String(formData.hora_ingreso) ?? ''} />
            <Inpu label="Hora Salida" placeholder="Hora Salida" type="text" name="hora_salida" value={String(formData.hora_salida) ?? ''} onChange={handleChange} />

            <button type="submit" className="bg-blue-500 text-white p-2 rounded-md">
                Guardar Cambios
            </button>
        </Form>
    )

}