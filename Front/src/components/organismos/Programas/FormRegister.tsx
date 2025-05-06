import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { Form } from "@heroui/form";
import { Input } from "@heroui/input";
import { addToast, Select, SelectItem } from "@heroui/react";
import { programaCreate, programaCreateSchema } from "@/schemas/programas";
import { useAreas } from "@/hooks/areas/useAreas";

type FormularioProps = {
  addData: (data: programaCreate) => Promise<void>;
  onClose: () => void;
  id: string;
};

export default function FormularioSede({
  addData,
  onClose,
  id,
}: FormularioProps) {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<programaCreate>({
    resolver: zodResolver(programaCreateSchema),
    mode: "onChange",
  });

  const { areas } = useAreas();

  const onSubmit = async (data: programaCreate) => {
    try {
      await addData(data);
      onClose();
      addToast({
        title: "Registro Exitoso",
        description: "Programa agregado correctamente",
        color: "success",
        timeout: 3000,
        shouldShowTimeoutProgress: true,
      });
    } catch (error) {
      console.error("Error al guardar el programa:", error);
    }
  };
  console.log("Errores", errors);
  return (
    <Form
      id={id}
      onSubmit={handleSubmit(onSubmit)}
      className="w-full space-y-4"
    >
      <Input
        label="Nombre del programa"
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
        name="fk_area"
        render={({ field }) => (
          <div className="w-full">
            <Select
              label="Área"
              placeholder="Selecciona un área"
              {...field}
              value={field.value ?? ""}
              onChange={(e) => field.onChange(Number(e.target.value))}
              isInvalid={!!errors.fk_area}
              errorMessage={errors.fk_area?.message}
            >
              {areas?.length ? (
                areas.map((area) => (
                  <SelectItem key={area.id_area}>{area.nombre}</SelectItem>
                ))
              ) : (
                <SelectItem isDisabled>No hay áreas disponibles</SelectItem>
              )}
            </Select>
          </div>
        )}
      />
    </Form>
  );
}
