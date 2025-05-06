import { Form } from "@heroui/form";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@heroui/input";
import { addToast, Select, SelectItem } from "@heroui/react";
import { useModulo } from "@/hooks/Modulos/useModulo";
import { PermisoCreate, PermisoCreateSchema } from "@/schemas/Permiso";

type FormularioProps = {
  addData: (permiso: PermisoCreate) => Promise<void>;
  onClose: () => void;
  id: string;
};

export default function Formulario({ addData, onClose, id }: FormularioProps) {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PermisoCreate>({
    resolver: zodResolver(PermisoCreateSchema),
    mode: "onChange",
  });

  const { modulos } = useModulo();

  const onSubmit = async (data: PermisoCreate) => {
    try {
      await addData(data);
      onClose();
      addToast({
        title: "Registro Exitoso",
        description: "Permiso agregado correctamente",
        color: "success",
        timeout: 3000,
        shouldShowTimeoutProgress: true,
      });
    } catch (error) {
      console.error("Error al cargar el permiso", error);
    }
  };
  console.log("Errores", errors)
  return (
    <Form
      id={id}
      onSubmit={handleSubmit(onSubmit)}
      className="w-full space-y-4"
    >
      <Input
        label="Permiso"
        placeholder="permiso"
        {...register("permiso")}
        isInvalid={!!errors.permiso}
        errorMessage={errors.permiso?.message}
      />
      <Controller
        control={control}
        name="fk_modulo"
        render={({ field }) => (
          <div className="w-full">
            <Select
              label="Modulo"
              {...field}
              className="w-full"
              placeholder="Selecciona un modulo..."
              aria-label="Seleccionar Modulo"
              onChange={(e) => field.onChange(Number(e.target.value))}
              isInvalid={!!errors.fk_modulo}
              errorMessage={errors.fk_modulo?.message}
            >
              {modulos?.length ? (
                modulos.map((modulo) => (
                  <SelectItem key={modulo.id_modulo} textValue={modulo.nombre}>
                    {modulo.nombre}
                  </SelectItem>
                ))
              ) : (
                <SelectItem isDisabled>No hay modulos disponibles</SelectItem>
              )}
            </Select>
          </div>
        )}
      />
    </Form>
  );
}
