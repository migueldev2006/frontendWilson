import { Form } from "@heroui/form";
import { Centro, CentroSchema } from "@/schemas/Centro";
import { Input, Select, SelectItem } from "@heroui/react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMunicipio } from "@/hooks/Municipio/useMunicipio";

type FormularioProps = {
  addData: (centros: Centro) => Promise<void>;
  onClose: () => void;
  id: string;
};

export default function FormCentros({ addData, onClose, id }: FormularioProps) {
  const {
    municipios,
    isLoading: loadingMuni,
    isError: errormuni,
  } = useMunicipio();

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<Centro>({
    resolver: zodResolver(CentroSchema),
  });

  const onSubmit = async (data: Centro) => {
    console.log(data);
    try {
      await addData(data);
      onClose();
    } catch (error) {
      console.error("Error al guardar:", error);
    }
  };

  return (
    <Form
      id={id}
      onSubmit={handleSubmit(onSubmit)}
      className="w-full space-y-4"
    >
      <Input
        {...register("nombre")}
        label="Nombre"
        placeholder="Nombre"
        type="text"
        isInvalid={!!errors.nombre} //color
        errorMessage={errors.nombre?.message}
      />

      <Controller
        control={control}
        name="estado"
        render={({ field }) => (
          <Select
            label="Estado"
            placeholder="Selecciona estado"
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

      {!loadingMuni && !errormuni && municipios && (
              <Controller
              control={control}
              name="fk_municipio"
              render={({ field }) => (
                <div className="w-full">
                  <Select
                    label="Municipio"
                    {...field}
                    value={field.value ?? ""}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    className="w-full"
                    placeholder="Selecciona un municipio..."
                    aria-label="Seleccionar Municipio"
                    isInvalid={!!errors.fk_municipio}
                    errorMessage={errors.fk_municipio?.message}
                  >
                    {/* Asegúrate de que users no sea undefined */}
                    {municipios?.length ? (
                      municipios.map((m) => (
                        <SelectItem key={m.id_municipio} textValue={m.nombre}>
                          {m.nombre}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem isDisabled>No hay usuarios disponibles</SelectItem>
                    )}
                  </Select>
                </div>
              )}
            />
      )}
    </Form>
  );
}
