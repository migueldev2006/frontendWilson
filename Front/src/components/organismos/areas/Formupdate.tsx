import { Input } from "@heroui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AreaUpdateSchema, AreaUpdate } from "@/schemas/Area";
import { useAreas } from "@/hooks/areas/useAreas";
import { Button } from "@heroui/button";
import { addToast } from "@heroui/react";

type FormuProps = {
  areas: AreaUpdate[];
  areaId: number;
  id: string;
  onclose: () => void;
};

export const FormUpdate = ({ areas, areaId, id, onclose }: FormuProps) => {
  const { updateArea, getAreaById } = useAreas();

  const foundArea = getAreaById(areaId, areas) as AreaUpdate;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AreaUpdate>({
    resolver: zodResolver(AreaUpdateSchema),
    mode: "onChange",
    defaultValues: {
      id_area: foundArea.id_area,
      nombre: foundArea.nombre,
      estado: foundArea.estado,
      fk_sede: foundArea.fk_sede,
      fk_usuario: foundArea.fk_usuario
    },
  });

  const onSubmit = async (data: AreaUpdate) => {
    console.log("Enviando datos:", data);
    if (!data.id_area) return;
    try {
      await updateArea(data.id_area, data);
      onclose();
      addToast({
        title: "Actualizacion Exitosa",
        description: "Area actualizada correctamente",
        color: "primary",
        timeout: 3000,
        shouldShowTimeoutProgress: true,
      });
    } catch (error) {
      console.error("Error al actualizar el área: ", error);
    }
  };

  console.log("Errores", errors);
  return (
    <form
      id={id}
      className="w-full space-y-4"
      onSubmit={handleSubmit(onSubmit)}
    >
      <Input
        label="Nombre"
        placeholder="Nombre"
        {...register("nombre")}
        isInvalid={!!errors.nombre}
        errorMessage={errors.nombre?.message}
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
    </form>
  );
};
