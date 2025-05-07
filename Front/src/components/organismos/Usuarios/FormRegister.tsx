import { Input } from "@heroui/input";
import { Select, SelectItem } from "@heroui/react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserSchema, User } from "@/schemas/User";
import { Form } from "@heroui/form";
import { useRol } from "@/hooks/Roles/useRol";

type FormularioProps = {
    addData: (user: User) => Promise<void>;
    onClose: () => void;
    id: string;
};

export default function Formulario({ addData, onClose, id }: FormularioProps) {

    const { roles, isLoading: loadinRoles, isError: errorRoles } = useRol();

    const {
        control,
        register,
        handleSubmit,
        formState: { errors },
        setValue
    } = useForm<User>({
        resolver: zodResolver(UserSchema),
        mode: "onChange"
    });
    



    const onSubmit = async (data: User) => {
        console.log(data);
        try {
            await addData(data);
            onClose();

        } catch (error) {
            console.error("Error al guardar:", error);
        }
    };


    return (
        
        <Form id={id} onSubmit={handleSubmit(onSubmit)} className="w-full space-y-4">
            
            <Input
                label="Documento"
                type="text"
                placeholder="Documento"
                {...register("documento", { valueAsNumber: true })}
                isInvalid={!!errors.documento}
                errorMessage={errors.documento?.message}
            />
            <Input
                label="Nombre"
                type="text"
                placeholder="Nombre"
                {...register("nombre")}
                isInvalid={!!errors.nombre}
                errorMessage={errors.nombre?.message}
            />
            <Input
                label="Apellido"
                type="text"
                placeholder="Apellido"
                {...register("apellido")}
                isInvalid={!!errors.apellido}
                errorMessage={errors.apellido?.message}
            />
            <Input
                label="Edad"
                type="text"
                placeholder="Edad"
                {...register("edad", { valueAsNumber: true })}
                isInvalid={!!errors.edad}
                errorMessage={errors.edad?.message}
            />
            <Input
                label="Teléfono"
                type="text"
                placeholder="Teléfono"
                {...register("telefono")}
                isInvalid={!!errors.telefono}
                errorMessage={errors.telefono?.message}
            />
            <Input
                label="Correo"
                type="email"
                placeholder="Correo"
                {...register("correo")}
                isInvalid={!!errors.correo}
                errorMessage={errors.correo?.message}
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
                    >
                        <SelectItem key="true">Activo</SelectItem>
                        <SelectItem key="false">Inactivo</SelectItem>
                    </Select>
                )}
            />

            {errors.estado && <p className="text-red-500">{errors.estado?.message}</p>}
            <Input
                label="Cargo"
                type="text"
                placeholder="Cargo"
                {...register("cargo")}
                isInvalid={!!errors.cargo}
                errorMessage={errors.cargo?.message}
            />
            <Input
                label="Contraseña"
                type="password"
                placeholder="Password"
                {...register("password")}
                isInvalid={!!errors.password}
                errorMessage={errors.password?.message}
            />

            {!loadinRoles && !errorRoles && roles && (
                <Select
                    aria-label="Roles"
                    placeholder="Selecciona un rol"
                    onChange={(e) => {setValue("fk_rol",parseInt(e.target.value))}}
                    isInvalid={!!errors.fk_rol}
                    errorMessage={errors.fk_rol?.message}
                >
                    {roles.map((roles) => (
                        <SelectItem key={roles.id_rol}>
                            {roles.nombre}
                        </SelectItem>
                    ))}
                </Select>
            )}
            

        </Form>
    );
}
