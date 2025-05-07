import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { Form } from "@heroui/form";
import { Input } from "@heroui/input";
import { addToast, Select, SelectItem } from "@heroui/react";
import { useAreas } from "@/hooks/areas/useAreas";
import { useTipoSitio } from "@/hooks/TipoSitio/useTipoSitio";
import { sitioCreate, sitioCreateSchema } from "@/schemas/sitios";

type FormularioProps = {
  addData: (data: sitioCreate) => Promise<void>;
  onClose: () => void;
  id: string;
};

export default function FormularioSitio({
  addData,
  onClose,
  id,
}: FormularioProps) {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<sitioCreate>({
    resolver: zodResolver(sitioCreateSchema),
    mode: "onChange",
  });

  const { areas } = useAreas();
  const { tipos } = useTipoSitio();

  const onSubmit = async (data: sitioCreate) => {
    try {
      await addData(data);
      onClose();
      addToast({
        title: "Registro Exitoso",
        description: "Sitio agregado correctamente",
        color: "success",
        timeout: 3000,
        shouldShowTimeoutProgress: true,
      });
    } catch (error) {
      console.error("Error al guardar sitio:", error);
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
        label="Nombre del sitio"
        type="text"
        placeholder="Nombre"
        {...register("nombre")}
        isInvalid={!!errors.nombre}
        errorMessage={errors.nombre?.message}
      />

      <Input
        label="Persona encargada"
        type="text"
        placeholder="Encargado"
        {...register("persona_encargada")}
        isInvalid={!!errors.persona_encargada}
        errorMessage={errors.persona_encargada?.message}
      />

      <Input
        label="Ubicación"
        type="text"
        placeholder="Ubicación"
        {...register("ubicacion")}
        isInvalid={!!errors.ubicacion}
        errorMessage={errors.ubicacion?.message}
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
          <div className="w-full mb-4">
            <Select
              label="Area"
              value={field.value ?? 0}
              onChange={(e) => field.onChange(Number(e.target.value))}
              placeholder="Selecciona un área..."
              isInvalid={!!errors.fk_area}
              errorMessage={errors.fk_area?.message}
            >
              {areas?.length ? (
                areas.map((area) => (
                  <SelectItem key={area.id_area} textValue={area.nombre}>
                    {area.nombre}
                  </SelectItem>
                ))
              ) : (
                <SelectItem isDisabled>No hay áreas disponibles</SelectItem>
              )}
            </Select>
          </div>
        )}
      />

      <Controller
        control={control}
        name="fk_tipo_sitio"
        render={({ field }) => (
          <div className="w-full">
            <Select
              label="Tipo Sitio"
              value={field.value ?? 0}
              onChange={(e) => field.onChange(Number(e.target.value))}
              placeholder="Selecciona un tipo..."
              isInvalid={!!errors.fk_tipo_sitio}
              errorMessage={errors.fk_tipo_sitio?.message}
            >
              {tipos?.length ? (
                tipos.map((tipo) => (
                  <SelectItem key={tipo.id_tipo} textValue={tipo.nombre}>
                    {tipo.nombre}
                  </SelectItem>
                ))
              ) : (
                <SelectItem isDisabled>No hay tipos disponibles</SelectItem>
              )}
            </Select>
          </div>
        )}
      />
    </Form>
  );
}
