import React from "react";
import { Form } from "@heroui/form"
import Inpu from "@/components/molecules/input";
import { Area } from "@/types/area";
import { Select, SelectItem } from "@heroui/react";
import {useSede} from "@/hooks/sedes/useSedes"


type FormularioProps = {

    addData: (area: Area) => Promise<void>;
    onClose: () => void;
    id: string
}

export default function Formulario({ addData, onClose, id }: FormularioProps) {

    const { sede, isLoading: loadingSedes, isError: errorSedes } = useSede();

    const [formData, setFormData] = React.useState<Area>({
        id_area: 0,
        nombre: "",
        persona_encargada: "",
        estado: true,
        created_at:"",
        updated_at:"",
        fk_sede: 0,
    });

    const onSubmit = async (e : React.FormEvent) => { //preguntar si esta bien no usar el e: React.FormEvent
        //y aqui el preventdefault
        e.preventDefault();
        try {
            console.log("Enviando formulario con datos:", formData);
            await addData(formData);
            console.log("area guardado correctamente");
            setFormData({
                id_area: 0,
                nombre: "",
                persona_encargada: "",
                estado: true,
                created_at:"",
                updated_at:"",
                fk_sede: 0,
            });
            onClose();
        } catch (error) {
            console.error("Error al cargar el area", error);
        }
    }

    return (
        <Form id={id} onSubmit={onSubmit} className="w-full space-y-4">
            <Inpu label="Nombre" placeholder="Nombre" type="text" name="nombre" value={formData.nombre} onChange={(e) => setFormData({ ...formData, nombre: e.target.value })} />
            <Inpu label="persona_encargada" placeholder="persona_encargada" type="text" name="persona_encargada" value={formData.persona_encargada} onChange={(e) => setFormData({ ...formData, persona_encargada: e.target.value })} />

            <Select
                aria-labelledby="estado"
                labelPlacement="outside"
                name="estado"
                placeholder="Estado"
                onChange={(e) => setFormData({ ...formData, estado: e.target.value === "true" })} // Convierte a booleano
            >
                <SelectItem key="true">Activo</SelectItem>
                <SelectItem key="false" >Inactivo</SelectItem>
            </Select>

            {/* <Inpu label="Estado" placeholder="Estado" type="checkbox" name="estado" value={formData.estado.toString()} onChange={(e) => setFormData({ ...formData, estado: e.target.checked })} /> */}

            

            {/* <Inpu label="Sede" placeholder="Sede" type="number" name="fk_sede" value={formData.fk_sede.toString()} onChange={(e) => setFormData({ ...formData, fk_sede: Number(e.target.value) })} /> */}

            {!loadingSedes && !errorSedes && sede && (
                    <Select
                      label="sedes"
                      name="fk_sede"
                      placeholder="Selecciona una sede"
                      onChange={(e) =>
                        setFormData({ ...formData, fk_sede: Number(e.target.value) })
                      }
                    >
                      {sede.map((sedes) => (
                        <SelectItem key={sedes.id_sede}>
                          {sedes.nombre}
                        </SelectItem>
                      ))}
                    </Select>
                  )}
        </Form>
    )
}