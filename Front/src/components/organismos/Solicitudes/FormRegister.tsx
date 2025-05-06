import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { Form } from "@heroui/form";
import { Input } from "@heroui/input";
import { addToast, Select, SelectItem } from "@heroui/react";
import { useUsuario } from "@/hooks/Usuarios/useUsuario";
import { useSitios } from "@/hooks/sitios/useSitios";
import { useInventario } from "@/hooks/Inventarios/useInventario";
import { useElemento } from "@/hooks/Elementos/useElemento";
import React from "react";
import { SolicitudCreate, SolicitudCreateSchema } from "@/schemas/Solicitud";

type FormularioProps = {
  addData: (solicitud: SolicitudCreate) => Promise<void>;
  onClose: () => void;
  id: string;
};

export default function Formulario({ addData, onClose, id }: FormularioProps) {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SolicitudCreate>({
    resolver: zodResolver(SolicitudCreateSchema),
    mode: "onChange",
    defaultValues:{
      estado: true,
      aceptada: false,
      pendiente: true,
      rechazada: false,
    }
  });

  const { users, isLoading: loadingUsers, isError: errorUsers } = useUsuario();
  const {
    sitios,
    isLoading: loadingSitios,
    isError: errorSitios,
  } = useSitios();
  const {
    inventarios,
    isLoading: loadingInventarios,
    isError: errorInventarios,
  } = useInventario();
  const {
    elementos,
    isLoading: loadingElementos,
    isError: errorElementos,
  } = useElemento();

  const [sitioSeleccionado, setSitioSeleccionado] = React.useState<
    number | null
  >(null);

  const onSubmit = async (data: SolicitudCreate) => {
    try {
      await addData(data);
      console.log("Solicitud guardada correctamente");
      onClose();
      addToast({
        title: "Registro Exitoso",
        description: "Solicitud agregada correctamente",
        color: "success",
        timeout: 3000,
        shouldShowTimeoutProgress: true,
      });
    } catch (error) {
      console.error("Error al cargar la solicitud", error);
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
        label="Descripción"
        type="text"
        placeholder="Descripción"
        {...register("descripcion")}
        isInvalid={!!errors.descripcion}
        errorMessage={errors.descripcion?.message}
      />

      <Input
        label="Cantidad"
        type="text"
        placeholder="Cantidad"
        {...register("cantidad", { valueAsNumber: true })}
        isInvalid={!!errors.cantidad}
        errorMessage={errors.cantidad?.message}
      />

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
            </div>
          )}
        />
      )}

      {!loadingSitios && !errorSitios && sitios && (
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
                {sitios.length ? (
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
      )}

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
