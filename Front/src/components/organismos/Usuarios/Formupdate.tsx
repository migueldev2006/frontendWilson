
import { Input } from "@heroui/input";
import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
import { UserUpdateSchema, UserUpdate } from "@/schemas/User";
import { User } from '@/schemas/User'
import { Form } from "@heroui/form";
import { useUsuario } from "@/hooks/Usuarios/useUsuario";
import { zodResolver } from "@hookform/resolvers/zod";


type FormuProps = {
    Users: (User & {key : string})[];
    userId: number;
    id: string
    onclose: () => void;
}

 export const FormUpdate = ({Users,userId,id, onclose} : FormuProps) => {

    const {updateUser, getUserById} = useUsuario();
    
    const foundUser = getUserById(userId,Users) as User;

    const { register,handleSubmit, formState : {errors},} = useForm<UserUpdate>({
        resolver : zodResolver(UserUpdateSchema),mode: "onChange",  defaultValues: {
            id_usuario : foundUser.id_usuario,
            nombre : foundUser.nombre,
            apellido : foundUser.apellido,
            edad : Number(foundUser.edad),
            telefono : foundUser.telefono,
            correo : foundUser.correo,
            cargo : foundUser.cargo
        }
    });
    
    const onSubmit = async (data : UserUpdate) => {
        console.log(data);
        if(!data.id_usuario) return;
        try {
            await updateUser(data.id_usuario,data);
            onclose();
        }catch(error){
            console.log("Error al actualizar el usuario : ",error)
        }
    };

    return (
        <Form id={id} className="w-full space-y-4" onSubmit={handleSubmit(onSubmit)}>

      <Input
        label="Nombre"
        placeholder="Nombre"
        {...register("nombre")}
        isInvalid={!!errors.nombre}
        errorMessage={errors.nombre?.message}
      />
      <Input
        label="Apellido"
        placeholder="Apellido"
        {...register("apellido")}
        isInvalid={!!errors.apellido}
        errorMessage={errors.apellido?.message}
      />
      <Input
        label="Edad"
        placeholder="Edad"
        type="text"
        {...register("edad", { valueAsNumber: true })}
        isInvalid={!!errors.edad}
        errorMessage={errors.edad?.message}
      />
      <Input
        label="Telefono"
        placeholder="Telefono"
        {...register("telefono")}
        isInvalid={!!errors.telefono}
        errorMessage={errors.telefono?.message}
      />
      <Input
        label="Correo"
        placeholder="Correo"
        type="email"
        {...register("correo")}
        isInvalid={!!errors.correo}
        errorMessage={errors.correo?.message}
      />
      <Input
        label="Cargo"
        placeholder="Cargo"
        {...register("cargo")}
        isInvalid={!!errors.cargo}
        errorMessage={errors.cargo?.message}
      />

      <button type="submit" className="bg-blue-500 text-white p-2 rounded-md">
        Guardar Cambios
      </button>
    </Form>
      );

};


