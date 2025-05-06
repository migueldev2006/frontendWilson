import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUnidad } from "@/hooks/UnidadesMedida/useUnidad";
import { useCategoria } from "@/hooks/Categorias/useCategorias";
import { useCaracteristica } from "@/hooks/Caracteristicas/useCaracteristicas";
import { Form } from "@heroui/form";
import { addToast, Input, Select, SelectItem } from "@heroui/react";
import { useState } from "react";
import { ElementoCreate, ElementoCreateSchema } from "@/schemas/Elemento";
import { CaracteristicaCreateSchema } from "@/schemas/Caracteristica";

type FormularioProps = {
  addData: (elemento: ElementoCreate) => Promise<{ id_elemento: number }>;
  onClose: () => void;
  id: string;
};

export default function Formulario({ addData, onClose, id }: FormularioProps) {
  const {
    control,
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ElementoCreate>({
    resolver: zodResolver(ElementoCreateSchema),
    mode: "onChange",
  });

  const { unidades } = useUnidad();
  const { categorias } = useCategoria();
  const { addCaracteristica } = useCaracteristica();
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<
    number | null
  >(null);
  const [caracteristica, setCaracteristica] = useState({
    nombre: "",
    codigo: "",
  });
  const [caracteristicaErrors, setCaracteristicaErrors] = useState<{
    nombre?: string;
    codigo?: string;
  }>({});
  const tipoElemento = watch("tipoElemento");

  const onSubmit = async (data: ElementoCreate) => {
    setCaracteristicaErrors({});
    try {
      if (caracteristica.nombre || caracteristica.codigo) {
        const result = CaracteristicaCreateSchema.safeParse(caracteristica);
        if (!result.success) {
          const fieldErrors = result.error.flatten().fieldErrors;
          setCaracteristicaErrors({
            nombre: fieldErrors.nombre?.[0],
            codigo: fieldErrors.codigo?.[0],
          });
          return;
        }
      }
      const { id_elemento } = await addData({
        ...data,
        estado: data.estado,
        tipoElemento: data.tipoElemento as "perecedero" | "no_perecedero",
      });

      console.log("Elemento creado:", id_elemento);
      if (caracteristica.nombre && caracteristica.codigo) {
        await addCaracteristica({
          ...caracteristica,
          fk_elemento: id_elemento,
        });
      }
      onClose();
      addToast({
        title: "Registro Exitoso",
        description: "Elemento agregado correctamente",
        color: "success",
        timeout: 3000,
        shouldShowTimeoutProgress: true,
      });
    } catch (error) {
      console.error("Error al guardar el elemento:", error);
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
        placeholder="Nombre"
        {...register("nombre")}
        isInvalid={!!errors.nombre}
        errorMessage={errors.nombre?.message}
      />
      <Input
        label="Descripción"
        placeholder="Descripción"
        {...register("descripcion")}
        isInvalid={!!errors.descripcion}
        errorMessage={errors.descripcion?.message}
      />
      <Input
        label="Valor"
        type="number"
        placeholder="Valor"
        {...register("valor", { valueAsNumber: true })}
        isInvalid={!!errors.valor}
        errorMessage={errors.valor?.message}
      />

      <Controller
        control={control}
        name="tipoElemento"
        render={({ field }) => (
          <Select
            label="Tipo de Elemento"
            placeholder="Selecciona tipo"
            {...field}
            value={field.value ?? ""}
            onChange={(e) => {
              const value = e.target.value;
              field.onChange(value);
              setValue("perecedero", value === "perecedero");
              setValue("no_perecedero", value === "no_perecedero");
            }}
            isInvalid={!!errors.tipoElemento}
            errorMessage={errors.tipoElemento?.message}
          >
            <SelectItem key="perecedero">Perecedero</SelectItem>
            <SelectItem key="no_perecedero">No Perecedero</SelectItem>
          </Select>
        )}
      />

      {tipoElemento === "perecedero" && (
        <Controller
          control={control}
          name="fecha_vencimiento"
          render={({ field }) => (
            <Input
              type="date"
              label="Fecha de Vencimiento"
              {...field}
              isInvalid={!!errors.fecha_vencimiento}
              errorMessage={errors.fecha_vencimiento?.message}
            />
          )}
        />
      )}

      <Input
        label="Fecha Permanencia"
        type="date"
        placeholder="Ingrese la fecha"
        {...register("fecha_uso")}
        isInvalid={!!errors.fecha_uso}
        errorMessage={errors.fecha_uso?.message}
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

      <Input
        label="Imagen"
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0] ?? undefined;
          setValue("imagen_elemento", file);
        }}
      />

      <Controller
        control={control}
        name="fk_unidad_medida"
        render={({ field }) => (
          <div className="w-full">
            <Select
              label="Unidad"
              {...field}
              className="w-full"
              placeholder="Selecciona una unidad de medida..."
              aria-label="Seleccionar Unidad de Medida"
              onChange={(e) => field.onChange(Number(e.target.value))}
              isInvalid={!!errors.fk_unidad_medida}
              errorMessage={errors.fk_unidad_medida?.message}
            >
              {unidades?.length ? (
                unidades.map((unidad) => (
                  <SelectItem key={unidad.id_unidad} textValue={unidad.nombre}>
                    {unidad.nombre}
                  </SelectItem>
                ))
              ) : (
                <SelectItem isDisabled>No hay unidades disponibles</SelectItem>
              )}
            </Select>
          </div>
        )}
      />

      <Controller
        control={control}
        name="fk_categoria"
        render={({ field }) => (
          <div className="w-full">
            <Select
              label="Categoria"
              {...field}
              className="w-full"
              placeholder="Selecciona una categoría..."
              aria-label="Seleccionar Categoría"
              onChange={(e) => {
                const value = Number(e.target.value);
                field.onChange(value);
                setCategoriaSeleccionada(value);
              }}
              isInvalid={!!errors.fk_categoria}
              errorMessage={errors.fk_categoria?.message}
            >
              {categorias?.length ? (
                categorias.map((cat) => (
                  <SelectItem key={cat.id_categoria} textValue={cat.nombre}>
                    {cat.nombre}
                  </SelectItem>
                ))
              ) : (
                <SelectItem isDisabled>
                  No hay categorías disponibles
                </SelectItem>
              )}
            </Select>
          </div>
        )}
      />
      {categoriaSeleccionada && (
        <>
          <h3>Características</h3>
          <Input
            label="Nombre"
            placeholder="Ingrese el nombre de la característica"
            value={caracteristica.nombre}
            onChange={(e) =>
              setCaracteristica((prev) => ({
                ...prev,
                nombre: e.target.value,
              }))
            }
            isInvalid={!!caracteristicaErrors.nombre}
            errorMessage={caracteristicaErrors.nombre}
          />
          <Input
            label="Código"
            placeholder="Ingrese el código"
            value={caracteristica.codigo}
            onChange={(e) =>
              setCaracteristica((prev) => ({
                ...prev,
                codigo: e.target.value,
              }))
            }
            isInvalid={!!caracteristicaErrors.codigo}
            errorMessage={caracteristicaErrors.codigo}
          />
        </>
      )}
    </Form>
  );
}
