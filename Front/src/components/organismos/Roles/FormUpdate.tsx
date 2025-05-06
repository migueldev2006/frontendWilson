import { Form } from "@heroui/form";
import { useRol } from "@/hooks/Roles/useRol";
import { RolUpdate, RolUpdateSchema } from "@/schemas/Rol";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { addToast } from "@heroui/react";

type Props = {
  roles: (RolUpdate & { id_rol?: number })[];
  rolId: number;
  id: string;
  onclose: () => void;
};

export const FormUpdate = ({ roles, rolId, id, onclose }: Props) => {
  const { updateRol, getRolById } = useRol();

  const foundRol = getRolById(rolId, roles) as RolUpdate;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RolUpdate>({
    resolver: zodResolver(RolUpdateSchema),
    mode: "onChange",
    defaultValues: {
      id_rol: foundRol.id_rol,
      nombre: foundRol.nombre,
      estado: foundRol.estado,
    },
  });

  const onSubmit = async (data: RolUpdate) => {
    console.log(data);
    if (!data.id_rol) return;
    try {
      await updateRol(data.id_rol, data);
      onclose();
      addToast({
        title: "Actualizacion Exitosa",
        description: "Rol actualizado correctamente",
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
