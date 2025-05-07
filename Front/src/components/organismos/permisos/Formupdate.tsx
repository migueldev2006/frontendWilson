import { Form } from "@heroui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { usePermisos } from "@/hooks/permisos/usePermisos";
import { PermisoCreateSchema, PermisoUpdate } from "@/schemas/Permiso";
import { addToast } from "@heroui/react";

type Props = {
  permisos: (PermisoUpdate & { id_permiso?: number })[];
  permisoId: number;
  id: string;
  onclose: () => void;
};

export const FormUpdate = ({ permisos, permisoId, id, onclose }: Props) => {
  const { updatePermisos, getPermisosById } = usePermisos();

  const foundPermiso = getPermisosById(permisoId, permisos) as PermisoUpdate;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PermisoUpdate>({
    resolver: zodResolver(PermisoCreateSchema),
    mode: "onChange",
    defaultValues: {
      id_permiso: foundPermiso.id_permiso,
      permiso: foundPermiso.permiso,
      estado: foundPermiso.estado,
      fk_modulo: foundPermiso.fk_modulo,
    },
  });

  const onSubmit = async (data: PermisoUpdate) => {
    console.log(data);
    if (!data.id_permiso) return;
    try {
      await updatePermisos(data.id_permiso, data);
      onclose();
      addToast({
        title: "Actualizacion Exitosa",
        description: "Permiso actualizado correctamente",
        color: "primary",
        timeout: 3000,
        shouldShowTimeoutProgress: true,
      });
    } catch (error) {
      console.log("Error al actualizar el rol : ", error);
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
        label="Permiso"
        placeholder="Ingrese el nombre del permiso"
        {...register("permiso")}
        isInvalid={!!errors.permiso}
        errorMessage={errors.permiso?.message}
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
