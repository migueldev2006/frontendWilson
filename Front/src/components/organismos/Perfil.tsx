import { useUsuario } from "@/hooks/Usuarios/useUsuario";
import { useNavigate } from "react-router-dom";
import { User } from "@/types/Usuario";
import React, { useEffect } from "react";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Avatar, Card } from "@heroui/react";

export const Perfil = () => {
  const navigate = useNavigate();
  const { users: usuarios = [], updateUser } = useUsuario();
  const idUsuarioActual = Number(localStorage.getItem("id_usuario"));

  const [formData, setFormData] = React.useState<User | null>(null);
  const [isEditing, setIsEditing] = React.useState(false);
  const [, setImagen] = React.useState<File | null>(null);
  const [preview, setPreview] = React.useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImagen(file);
      setPreview(URL.createObjectURL(file)); // Genera la URL para previsualizar la imagen
    }
  };

  useEffect(() => {
    if (usuarios.length > 0) {
      const user = usuarios.find((u) => u.id_usuario === idUsuarioActual);
      if (user) setFormData(user);
    }
  }, [usuarios, idUsuarioActual]);

  const handleClosePerfil = () => {
    navigate("/");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (formData) {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleActualizar = async () => {
    if (formData) {
      try {
        await updateUser(formData.id_usuario, formData);
        alert("Información actualizada");
        setIsEditing(false);
      } catch (err) {
        console.error(err);
        alert("Error al actualizar");
      }
    }
  };

  if (!formData) return <p>Cargando perfil...</p>;

  return (
    <>
      <div className="relative left-56 pl-80 pt-4  inline-block">
        <div>
          <Avatar
            isBordered
            as="div"
            className="transition-transform cursor-pointer"
            color="secondary"
            name={formData?.nombre}
            size="lg"
            src={preview || formData?.imagen_url || undefined}
          />
          <label
            htmlFor="imageUpload"
            className="absolute bottom-0 right-0 bg-white text-white rounded-full p-2 cursor-pointer"
          >
          </label>

          <input
            id="imageUpload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageChange}
          />
        </div>
      </div>
      <div className="perfil-modal">
        <h2 className="text-center mt-4 mb-4">Perfil de Usuario</h2>

        <Card className="m-4 flex gap-4 grid xl:grid-cols-3">
          <Input
            label="Documento"
            name="documento"
            value={formData.documento.toString()}
            isDisabled
          />
          <Input
            label="Nombre"
            name="nombre"
            value={formData.nombre}
            onChange={handleInputChange}
            isDisabled={!isEditing}
          />
          <Input
            label="Apellido"
            name="apellido"
            value={formData.apellido}
            onChange={handleInputChange}
            isDisabled={!isEditing}
          />
          <Input
            label="Telefono"
            name="telefono"
            value={formData.telefono}
            onChange={handleInputChange}
            isDisabled={!isEditing}
          />
          <Input
            label="Correo"
            name="correo"
            value={formData.correo}
            onChange={handleInputChange}
            isDisabled={!isEditing}
          />
          <Input
            label="Edad"
            name="edad"
            value={formData.edad.toString()}
            onChange={handleInputChange}
            isDisabled={!isEditing}
          />
        </Card>

        <div className="flex justify-center gap-4 mb-4">
          {!isEditing ? (
            <Button onPress={() => setIsEditing(true)}>Editar Perfil</Button>
          ) : (
            <>
              <Button onPress={handleActualizar}>Guardar Cambios</Button>
              <Button  onPress={() => setIsEditing(false)}>
                Cancelar
              </Button>
            </>
          )}
          <Button onPress={handleClosePerfil} >
            Volver al Inicio
          </Button>
        </div>
      </div>
    </>
  );
};
