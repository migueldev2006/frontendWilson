import React from "react";
import { Form } from "@heroui/form"
import Inpu from "@/components/molecules/input";
import { Sitios } from "@/types/sitios";
import { Select, SelectItem } from "@heroui/react";
import {useAreas} from '@/hooks/areas/useAreas';

type FormularioProps = {

    addData: (sitio: Sitios) => Promise<void>;
    onClose: () => void;
    id: string
}

export default function Formulario({ addData, onClose, id }: FormularioProps) {


    const [formData, setFormData] = React.useState<Sitios>({
        id_sitio: 0,
        nombre: "",
        persona_encargada: "",
        ubicacion: "",
        estado: true,
        created_at:"",
        updated_at:"",
        fk_tipo_sitio: 0,
        fk_area: 0,
    });

    const { areas, isLoading: loadingAreas, isError: errorAreas } = useAreas();

    const onSubmit = async (e : React.FormEvent) => { //preguntar si esta bien no usar el e: React.FormEvent
        //y aqui el preventdefault
        e.preventDefault();
        try {
            console.log("Enviando formulario con datos:", formData);
            await addData(formData);
            console.log("Sitio guardado correctamente");
            setFormData({
                id_sitio: 0,
                nombre: "",
                persona_encargada: "",
                ubicacion: "",
                estado: true,
                created_at:"",
                updated_at:"",
                fk_tipo_sitio: 0,
                fk_area: 0,
            });
            onClose();
        } catch (error) {
            console.error("Error al cargar el sitio", error);
        }
    }

    return (
        <Form id={id} onSubmit={onSubmit} className="w-full space-y-4">
           
            <Inpu label="Nombre" placeholder="Nombre" type="text" name="nombre" value={formData.nombre} onChange={(e) => setFormData({ ...formData, nombre: e.target.value })} />
            <Inpu label="persona encargada" placeholder="persona encargada" type="text" name="persona_encargada" value={formData.persona_encargada} onChange={(e) => setFormData({ ...formData, persona_encargada: e.target.value })} />
            <Inpu label="ubicacion" placeholder="ubicacion" type="text" name="ubicacion" value={formData.ubicacion} onChange={(e) => setFormData({ ...formData, ubicacion: e.target.value })} />
            
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

       
            <Inpu label="tipo sitio" placeholder="tipo sitio" type="number" name="fk_rol" value={formData.fk_tipo_sitio.toString()} onChange={(e) => setFormData({ ...formData, fk_tipo_sitio: Number(e.target.value) })} />
            
            {!loadingAreas && !errorAreas && areas && (
                    <Select
                      label="areas"
                      name="fk_area"
                      placeholder="Selecciona una area"
                      onChange={(e) =>
                        setFormData({ ...formData, fk_area: Number(e.target.value) })
                      }
                    >
                      {areas.map((area) => (
                        <SelectItem key={area.id_area}>
                          {area.nombre}
                        </SelectItem>
                      ))}
                    </Select>
                  )}
           
            {/* <Inpu label="area" placeholder="area" type="number" name="fk_area" value={formData.fk_area.toString()} onChange={(e) => setFormData({ ...formData, fk_area: Number(e.target.value) })} /> */}

        </Form>
    )
}