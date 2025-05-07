import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { Form } from "@heroui/form";
import { Input } from "@heroui/input";
import { AreaCreate, AreaCreateSchema } from "@/schemas/Area";
import { addToast, Select, SelectItem } from "@heroui/react";
import { useSede } from "@/hooks/sedes/useSedes";
import { useUsuario } from "@/hooks/Usuarios/useUsuario";

type FormularioProps = {
  addData: (area: AreaCreate) => Promise<void>;
  onClose: () => void;
  id: string;
};

export default function Formulario({ addData, onClose, id }: FormularioProps) {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AreaCreate>({
    resolver: zodResolver(AreaCreateSchema),
    mode: "onChange",
  });

  const { sede } = useSede();
  const { users } = useUsuario();

  const onSubmit = async (data: AreaCreate) => {
    try {
      await addData(data);
      onClose();
      addToast({
        title: "Registro Exitoso",
        description: "Area agregada correctamente",
        color: "success",
        timeout: 3000,
        shouldShowTimeoutProgress: true,
      });
    } catch (error) {
      console.error("Error al guardar:", error);
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
        label="Nombre"
        type="text"
        placeholder="Nombre"
        {...register("nombre")}
        isInvalid={!!errors.nombre}
        errorMessage={errors.nombre?.message}
      />

      <Controller
        control={control}
        name="estado"
        render={({ field }) => (
          <Select
            label="Estado"
            placeholder="Seleccione un estado"
            {...field}
            value={field.value ? "true" : "false"}
            onChange={(e) => field.onChange(e.target.value === "true")}
            isInvalid={!!errors.estado}
            errorMessage={errors.estado?.message}
          >
            <SelectItem key="true">Activo</SelectItem>
            <SelectItem key="false">Inactivo</SelectItem>
          </Select>
        )}
      />

      <Controller
        control={control}
        name="fk_sede"
        render={({ field }) => (
          <div className="w-full">
            <Select
              label="Sede"
              {...field}
              value={field.value ?? ""}
              onChange={(e) => field.onChange(Number(e.target.value))}
              className="w-full"
              placeholder="Selecciona una sede..."
              aria-label="Seleccionar Sede"
              isInvalid={!!errors.fk_sede}
              errorMessage={errors.fk_sede?.message}
            >
              {sede?.length ? (
                sede.map((s) => (
                  <SelectItem key={s.id_sede} textValue={s.nombre}>
                    {s.nombre}
                  </SelectItem>
                ))
              ) : (
                <SelectItem isDisabled>No hay sedes disponibles</SelectItem>
              )}
            </Select>
          </div>
        )}
      />

      <Controller
        control={control}
        name="fk_usuario"
        render={({ field }) => (
          <div className="w-full">
            <Select
              label="Usuario"
              {...field}
              value={field.value ?? ""}
              onChange={(e) => field.onChange(Number(e.target.value))}
              className="w-full"
              placeholder="Selecciona un usuario..."
              aria-label="Seleccionar Usuario"
              isInvalid={!!errors.fk_usuario}
              errorMessage={errors.fk_usuario?.message}
            >
              {/* Asegúrate de que users no sea undefined */}
              {users?.length ? (
                users.map((u) => (
                  <SelectItem key={u.id_usuario} textValue={u.nombre}>
                    {u.nombre}
                  </SelectItem>
                ))
              ) : (
                <SelectItem isDisabled>No hay usuarios disponibles</SelectItem>
              )}
            </Select>
          </div>
        )}
      />
    </Form>
  );
}
