import { Form } from "@heroui/form";
import { addToast, Input, Select, SelectItem } from "@heroui/react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUsuario } from "@/hooks/Usuarios/useUsuario";
import { useTipoMovimiento } from "@/hooks/TiposMovimento/useTipoMovimiento";
import { useInventario } from "@/hooks/Inventarios/useInventario";
import { useSitios } from "@/hooks/sitios/useSitios";
import { useElemento } from "@/hooks/Elementos/useElemento";
import React, { useState } from "react";
import { MovimientoCreate, MovimientoCreateSchema } from "@/schemas/Movimento";

type FormularioProps = {
  addData: (movimiento: MovimientoCreate) => Promise<void>;
  onClose: () => void;
  id: string;
};

export default function Formulario({ addData, onClose, id }: FormularioProps) {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<MovimientoCreate>({
    resolver: zodResolver(MovimientoCreateSchema),
    mode: "onChange",
    defaultValues:{
      estado: true,
      aceptado: false,
      en_proceso: true,
      cancelado: false,
      devolutivo:false,
      no_devolutivo:true,
      fecha_devolucion:null
    }
  });

  const { users, isLoading: loadingUsers, error: errorUsers } = useUsuario();
  const {
    tipos,
    isLoading: loadingTipos,
    error: errorTipos,
  } = useTipoMovimiento();
  const { sitios } = useSitios();
  const {
    inventarios,
    isLoading: loadingInventarios,
    error: errorInventarios,
  } = useInventario();
  const {
    elementos,
    isLoading: loadingElementos,
    error: errorElementos,
  } = useElemento();
  const [sitioSeleccionado, setSitioSeleccionado] = React.useState<
    number | null
  >(null);
  const [isDevolutivo, setIsDevolutivo] = useState(false);

  const onSubmit = async (data: MovimientoCreate) => {
    try {
      await addData(data);
      onClose();
      addToast({
        title: "Registro Exitoso",
        description: "Movimiento agregado correctamente",
        color: "success",
        timeout: 3000,
        shouldShowTimeoutProgress: true,
      });
    } catch (error) {
      console.error("Error al guardar movimiento:", error);
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
        label="Descripción"
        placeholder="Descripción"
        type="text"
        {...register("descripcion")}
        isInvalid={!!errors.descripcion}
        errorMessage={errors.descripcion?.message}
      />

      <Input
        label="Cantidad"
        placeholder="Cantidad"
        type="text"
        {...register("cantidad", { valueAsNumber: true })}
        isInvalid={!!errors.cantidad}
        errorMessage={errors.cantidad?.message}
      />

      <Input
        label="Hora de Ingreso"
        placeholder="Hora Ingreso"
        type="time"
        {...register("hora_ingreso")}
        isInvalid={!!errors.hora_ingreso}
        errorMessage={errors.hora_ingreso?.message}
      />

      <Input
        label="Hora de Salida"
        placeholder="Hora Salida"
        type="time"
        {...register("hora_salida")}
        isInvalid={!!errors.hora_salida}
        errorMessage={errors.hora_salida?.message}
      />

      <Controller
        control={control}
        name="tipo_bien"
        render={({ field }) => (
          <Select
            label="Tipo de Bien"
            placeholder="Selecciona un tipo"
            {...field}
            isInvalid={!!errors.tipo_bien}
            errorMessage={errors.tipo_bien?.message}
            onChange={(e) => {
              const value = e.target.value;
              field.onChange(value);
              setIsDevolutivo(value === "devolutivo");
            }}
            value={field.value}
          >
            <SelectItem key="devolutivo" textValue="Devolutivo">
              Devolutivo
            </SelectItem>
            <SelectItem key="no_devolutivo" textValue="No Devolutivo">
              No Devolutivo
            </SelectItem>
          </Select>
        )}
      />

      {isDevolutivo && (
        <Controller
          control={control}
          name="fecha_devolucion"
          render={({ field }) => (
            <Input
              {...field}
              type="date"
              onChange={(e) => {
                const value = e.target.value;
                field.onChange(value ? value : null);
              }}
              label="Fecha de Devolución"
              isInvalid={!!errors.fecha_devolucion}
              errorMessage={errors.fecha_devolucion?.message}
              value={field.value ?? ""}
            />
          )}
        />
      )}

      {!loadingUsers && !errorUsers && users && (
        <Controller
          control={control}
          name="fk_usuario"
          render={({ field }) => (
            <div className="w-full">
              <Select
                {...field}
                label="Usuario"
                placeholder="Selecciona un usuario"
                aria-label="Seleccionar usuario"
                className="w-full"
                onChange={(e) => field.onChange(Number(e.target.value))}
                isInvalid={!!errors.fk_usuario}
                errorMessage={errors.fk_usuario?.message}
              >
                {users.length ? (
                  users.map((usuario) => (
                    <SelectItem
                      key={usuario.id_usuario}
                      textValue={usuario.nombre}
                    >
                      {usuario.nombre}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem isDisabled>
                    No hay usuarios disponibles
                  </SelectItem>
                )}
              </Select>
              {errors.fk_usuario && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.fk_usuario.message}
                </p>
              )}
            </div>
          )}
        />
      )}

      {!loadingTipos && !errorTipos && tipos && (
        <Controller
          control={control}
          name="fk_tipo_movimiento"
          render={({ field }) => (
            <div className="w-full">
              <Select
                {...field}
                label="Tipo de Movimiento"
                placeholder="Selecciona un tipo de movimiento"
                aria-label="Seleccionar tipo de movimiento"
                className="w-full"
                onChange={(e) => field.onChange(Number(e.target.value))}
                isInvalid={!!errors.fk_tipo_movimiento}
                errorMessage={errors.fk_tipo_movimiento?.message}
              >
                {tipos.length ? (
                  tipos.map((tipo) => (
                    <SelectItem key={tipo.id_tipo} textValue={tipo.nombre}>
                      {tipo.nombre}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem isDisabled>
                    No hay tipos de movimiento disponibles
                  </SelectItem>
                )}
              </Select>
            </div>
          )}
        />
      )}

      <Controller
        control={control}
        name="fk_sitio"
        render={({ field }) => (
          <div className="w-full">
            <Select
              {...field}
              label="Sitio"
              placeholder="Selecciona un sitio"
              aria-label="Seleccionar sitio"
              className="w-full"
              onChange={(e) => {
                const sitioId = Number(e.target.value);
                field.onChange(sitioId);
                setSitioSeleccionado(sitioId);
              }}
              isInvalid={!!errors.fk_sitio}
              errorMessage={errors.fk_sitio?.message}
            >
              {sitios?.length ? (
                sitios.map((sitio) => (
                  <SelectItem key={sitio.id_sitio} textValue={sitio.nombre}>
                    {sitio.nombre}
                  </SelectItem>
                ))
              ) : (
                <SelectItem isDisabled>No hay sitios disponibles</SelectItem>
              )}
            </Select>
          </div>
        )}
      />

      {!loadingInventarios &&
        !errorInventarios &&
        inventarios &&
        !loadingElementos &&
        !errorElementos &&
        elementos &&
        sitioSeleccionado && (
          <Controller
            control={control}
            name="fk_inventario"
            render={({ field }) => (
              <div className="w-full">
                <Select
                  {...field}
                  label="Elemento del Inventario"
                  placeholder="Selecciona un elemento del inventario"
                  aria-label="Seleccionar elemento del inventario"
                  className="w-full"
                  onChange={(e) => field.onChange(Number(e.target.value))}
                  isInvalid={!!errors.fk_inventario}
                  errorMessage={errors.fk_inventario?.message}
                >
                  {inventarios.filter(
                    (inv) => inv.fk_sitio === sitioSeleccionado
                  ).length ? (
                    inventarios
                      .filter((inv) => inv.fk_sitio === sitioSeleccionado)
                      .map((inventario) => {
                        const elemento = elementos.find(
                          (e) => e.id_elemento === inventario.fk_elemento
                        );
                        return (
                          <SelectItem
                            key={inventario.id_inventario}
                            textValue={
                              elemento?.nombre || "Elemento no disponible"
                            }
                          >
                            {elemento
                              ? elemento.nombre
                              : "Elemento no disponible"}
                          </SelectItem>
                        );
                      })
                  ) : (
                    <SelectItem isDisabled>
                      No hay elementos disponibles
                    </SelectItem>
                  )}
                </Select>
              </div>
            )}
          />
        )}
    </Form>
  );
}
