import { Form } from "@heroui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { sitio, sitioUpdate, sitioUpdateSchema } from "@/schemas/sitios";
import { useSitios } from "@/hooks/sitios/useSitios";
import { addToast } from "@heroui/react";

type Props = {
  sitios: (sitioUpdate & { id_sitio?: number })[];
  sitioId: number;
  id: string;
  onclose: () => void;
};

export const FormUpdate = ({ sitios, sitioId, id, onclose }: Props) => {
  const { updateSitio, getSitioById } = useSitios();

  const foundSitio = getSitioById(sitioId, sitios) as sitio;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<sitioUpdate>({
    resolver: zodResolver(sitioUpdateSchema),
    mode: "onChange",
    defaultValues: {
      id_sitio: foundSitio.id_sitio ?? 0,
      nombre: foundSitio.nombre,
      persona_encargada: foundSitio.persona_encargada,
      ubicacion: foundSitio.ubicacion,
      estado: foundSitio.estado,
      fk_tipo_sitio: foundSitio.fk_tipo_sitio,
      fk_area: foundSitio.fk_area,
    },
  });

  const onSubmit = async (data: sitioUpdate) => {
    console.log(data);
    if (!data.id_sitio) return;
    try {
      await updateSitio(data.id_sitio, data);
      onclose();
      addToast({
        title: "Actualizacion Exitosa",
        description: "Sitio actualizado correctamente",
        color: "primary",
        timeout: 3000,
        shouldShowTimeoutProgress: true,
      });
    } catch (error) {
      console.log("Error al actualizar la sede : ", error);
    }
  };

  console.log("Errores", errors);

  return (
    <Form
      id={id}
      className="w-full space-y-4"
      onSubmit={handleSubmit(onSubmit)}
    >
      <Input
        label="Nombre del sitio"
        type="text"
        placeholder="Nombre"
        {...register("nombre")}
        isInvalid={!!errors.nombre}
        errorMessage={errors.nombre?.message}
      />

      <Input
        label="Persona encargada"
        type="text"
        placeholder="Encargado"
        {...register("persona_encargada")}
        isInvalid={!!errors.persona_encargada}
        errorMessage={errors.persona_encargada?.message}
      />

      <Input
        label="Ubicación"
        type="text"
        placeholder="Ubicación"
        {...register("ubicacion")}
        isInvalid={!!errors.ubicacion}
        errorMessage={errors.ubicacion?.message}
      />

      <div className="justify-center pl-10">
        <Button
          type="submit"
          isLoading={isSubmitting}
          className="w-full bg-blue-700 text-white p-2 rounded-xl"
        >
          Guardar
        </Button>
      </div>
    </Form>
  );
};
