import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { Form } from "@heroui/form";
import { Input } from "@heroui/input";
import { addToast, Select, SelectItem } from "@heroui/react";
import { usePrograma } from "@/hooks/programas/usePrograma";
import { FichaCreate, fichaCreateSchema } from "@/schemas/fichas";

type FormularioProps = {
  addData: (ficha: FichaCreate) => Promise<void>;
  onClose: () => void;
  id: string;
};

export default function Formulario({ addData, onClose, id }: FormularioProps) {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FichaCreate>({
    resolver: zodResolver(fichaCreateSchema),
    mode: "onChange",
  });

  const { programas } = usePrograma();

  const onSubmit = async (data: FichaCreate) => {
    try {
      await addData(data);
      onClose();
      addToast({
        title: "Registro Exitoso",
        description: "Ficha agregada correctamente",
        color: "success",
        timeout: 3000,
        shouldShowTimeoutProgress: true,
      });
    } catch (error) {
      console.error("Error al guardar la ficha:", error);
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
        label="Código de Ficha"
        type="text"
        placeholder="Código de Ficha"
        {...register("codigo_ficha", { valueAsNumber: true })}
        isInvalid={!!errors.codigo_ficha}
        errorMessage={errors.codigo_ficha?.message}
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
        name="fk_programa"
        render={({ field }) => (
          <div className="w-full">
            <Select
              label="Programa"
              placeholder="Selecciona un programa"
              {...field}
              value={field.value ?? ""}
              onChange={(e) => field.onChange(Number(e.target.value))}
              isInvalid={!!errors.fk_programa}
              errorMessage={errors.fk_programa?.message}
            >
              {programas?.length ? (
                programas.map((programa) => (
                  <SelectItem key={programa.id_programa}>
                    {programa.nombre}
                  </SelectItem>
                ))
              ) : (
                <SelectItem isDisabled>No hay programas disponibles</SelectItem>
              )}
            </Select>
          </div>
        )}
      />
    </Form>
  );
}
