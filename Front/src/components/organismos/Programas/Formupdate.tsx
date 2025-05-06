import { Form } from "@heroui/form";
import { usePrograma } from "@/hooks/programas/usePrograma";
import { programaUpdate, programaUpdateSchema } from "@/schemas/programas";
import { Input } from "@heroui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@heroui/button";
import { addToast } from "@heroui/react";

type Props = {
  programas: programaUpdate[];
  programaId: number;
  id: string;
  onclose: () => void;
};

export const FormUpdate = ({ programas, programaId, id, onclose }: Props) => {
  const { updatePrograma, getProgramaById } = usePrograma();

  const foundPrograma = getProgramaById(
    programaId,
    programas
  ) as programaUpdate;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<programaUpdate>({
    resolver: zodResolver(programaUpdateSchema),
    mode: "onChange",
    defaultValues: {
      id_programa: foundPrograma.id_programa,
      nombre: foundPrograma.nombre,
      estado: foundPrograma.estado,
      fk_area: foundPrograma.fk_area,
    },
  });

  const onSubmit = async (data: programaUpdate) => {
    console.log(data);
    if (!data.id_programa) return;
    try {
      await updatePrograma(data.id_programa, data);
      onclose();
      addToast({
        title: "Actualizacion Exitosa",
        description: "Programa actualizado correctamente",
        color: "primary",
        timeout: 3000,
        shouldShowTimeoutProgress: true,
      });
    } catch (error) {
      console.log("Error al actualizar el programa: ", error);
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
        label="Nombre del Programa"
        type="text"
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
