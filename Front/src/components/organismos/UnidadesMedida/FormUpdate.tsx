import { Form } from "@heroui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { useUnidad } from "@/hooks/UnidadesMedida/useUnidad";
import { UnidadUpdate, UnidadUpdateSchema } from "@/schemas/Unidad";
import { addToast } from "@heroui/react";

type Props = {
  unidades: (UnidadUpdate & { id_unidad?: number })[];
  unidadId: number;
  id: string;
  onclose: () => void;
};

export const FormUpdate = ({ unidades, unidadId, id, onclose }: Props) => {
  const { updateUnidad, getUnidadById } = useUnidad();

  const foundUnidad = getUnidadById(unidadId, unidades) as UnidadUpdate;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UnidadUpdate>({
    resolver: zodResolver(UnidadUpdateSchema),
    mode: "onChange",
    defaultValues: {
      id_unidad: foundUnidad.id_unidad ?? 0,
      nombre: foundUnidad.nombre,
      estado: foundUnidad.estado,
    },
  });

  const onSubmit = async (data: UnidadUpdate) => {
    console.log(data);
    if (!data.id_unidad) return;
    try {
      await updateUnidad(data.id_unidad, data);
      onclose();
      addToast({
        title: "Actualizacion Exitosa",
        description: "Unidad actualizada correctamente",
        color: "primary",
        timeout: 3000,
        shouldShowTimeoutProgress: true,
      });
    } catch (error) {
      console.log("Error al actualizar la unidad : ", error);
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
    </Form>
  );
};
