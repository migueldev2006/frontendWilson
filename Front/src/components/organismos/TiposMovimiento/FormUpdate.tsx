import { Form } from "@heroui/form";
import { useTipoMovimiento } from "@/hooks/TiposMovimento/useTipoMovimiento";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { TipoUpdate, TipoUpdateSchema } from "@/schemas/TipoMovimiento";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { addToast } from "@heroui/react";

type Props = {
  tipos: (TipoUpdate & { id_tipo?: number })[];
  tipoId: number;
  id: string;
  onclose: () => void;
};

export const FormUpdate = ({ tipos, tipoId, id, onclose }: Props) => {
  const { updateTipoMovimiento, getTipoMovimientoById } = useTipoMovimiento();

  const foundRol = getTipoMovimientoById(tipoId, tipos) as TipoUpdate;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TipoUpdate>({
    resolver: zodResolver(TipoUpdateSchema),
    mode: "onChange",
    defaultValues: {
      id_tipo: foundRol.id_tipo,
      nombre: foundRol.nombre,
      estado: foundRol.estado,
    },
  });

  const onSubmit = async (data: TipoUpdate) => {
    console.log(data);
    if (!data.id_tipo) return;
    try {
      await updateTipoMovimiento(data.id_tipo, data);
      onclose();
      addToast({
        title: "Actualizacion Exitosa",
        description: "Tipo Movimiento actualizado correctamente",
        color: "primary",
        timeout: 3000,
        shouldShowTimeoutProgress: true,
      });
    } catch (error) {
      console.log("Error al actualizar el tipo de movimiento : ", error);
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
