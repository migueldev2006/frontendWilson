import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  DropdownItem,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  Avatar,
  // Button,
} from "@heroui/react";
import { FormatrackLogo } from "../atoms/Icons";
import { BellIcon } from "@heroicons/react/24/outline";
import { ReactNode, useState } from "react";
import { useNavigate } from "react-router-dom"; // Asegúrate de importar useNavigate
// import Modall from "../molecules/modal";
// import { useNotificaciones } from "@/hooks/Notificaciones/useNotificacion";
import Cookies from "universal-cookie";

type NavProps = {
  en_proceso: string;
  children?: ReactNode;
  onOpenNotificationes?: () => void;
  id_notificacion: number;
  titulo: string;
  mensaje: string;
};

export function Nav({ children }: NavProps) {
  const [, setIsModalOpen] = useState(false);
  const [notificationes] = useState<NavProps[]>([]);
  const navigate = useNavigate();
  const cookies = new Cookies();
  // const {
  //   notificaciones,
  //   isLoading,
  //   aceptarMovimiento,
  //   cancelarMovimiento,
  //   aceptarSolicitud,
  //   cancelarSolicitud,
  // } = useNotificaciones();

  // const handleCloseModal = () => {
  //   setIsModalOpen(false);
  // };

  // function handleClickNotificacion(id_notificacion: number): void {
  //   throw new Error("Function not implemented.");
  // }

  const handleGoToPerfil = () => {
    navigate("/perfil");
  };

  return (
    <>
      <Navbar isBordered>
        <NavbarContent justify="start">
          <NavbarBrand className="mr-4">
            <FormatrackLogo />
            <p className="hidden sm:block font-bold text-inherit">Formatrack</p>
          </NavbarBrand>
        </NavbarContent>

        <NavbarContent as="div" className="items-center gap-4" justify="end">
          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <button className="relative text-gray-700 dark:text-white">
                <BellIcon className="w-6 h-6" />
                {/* {notificationes.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full px-1.5 text-xs">
                    {notificationes.length}
                  </span>
                )} */}
              </button>
            </DropdownTrigger>
            <DropdownMenu
              aria-label="Notificaciones recientes"
              className="max-w-sm w-72"
            >
              <DropdownItem
                textValue="notificaciones"
                className="font-semibold text-center"
                isReadOnly
                key={`notificaciones-header`}
              >
                Notificaciones
              </DropdownItem>

              <DropdownItem
                textValue="ver-todo"
                onPress={() => setIsModalOpen(true)}
                className="text-center text-blue-500 hover:underline"
                key={`ver-todo`}
              >
                Ver todo
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>

          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <Avatar
                isBordered
                as="button"
                className="transition-transform"
                color="secondary"
                name="Usuario"
                size="sm"
              />
            </DropdownTrigger>
            <DropdownMenu variant="flat">
              <DropdownItem key="Profile" onPress={handleGoToPerfil}>
                Perfil
              </DropdownItem>
              <DropdownItem key="logout" color="danger" onClick={()=>{cookies.remove("token");window.location.href='/login'}}>
                Cerrar Sesión
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </NavbarContent>
        <div>{children}</div>
      </Navbar>

      {/*<Modall
        ModalTitle="Notificaciones"
        isOpen={isModalOpen}
        onOpenChange={handleCloseModal}
      >
         <div className="space-y-4">
          {isLoading ? (
            <p>Cargando notificaciones...</p>
          ) : !notificaciones || notificaciones.length === 0 ? (
            <p>No tienes notificaciones nuevas.</p>
          ) : (
            notificaciones.map((n) => (
              <div
                key={`notificacion-${n.id_notificacion}`}
                className="flex flex-col p-3 border rounded-md shadow-sm"
              >
                <strong className="text-base">{n.titulo}</strong>
                <p className="text-sm text-gray-600">{n.mensaje}</p>

                {n.en_proceso && (
                  <div className="flex gap-2 mt-2">
                    {n.fk_movimiento && (
                      <>
                        <Button
                          size="sm"
                          onPress={() => aceptarMovimiento(n.fk_movimiento!)}
                        >
                          Aceptar
                        </Button>
                        <Button
                          size="sm"
                          variant="flat"
                          onPress={() => cancelarMovimiento(n.fk_movimiento!)}
                        >
                          Rechazar
                        </Button>
                      </>
                    )}

                    {n.fk_solicitud && (
                      <>
                        <Button
                          size="sm"
                          onPress={() => aceptarSolicitud(n.fk_solicitud!)}
                        >
                          Aceptar
                        </Button>
                        <Button
                          size="sm"
                          variant="flat"
                          onPress={() => cancelarSolicitud(n.fk_solicitud!)}
                        >
                          Rechazar
                        </Button>
                      </>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </Modall> */}
    </>
  );
}
