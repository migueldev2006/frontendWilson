import { useState } from "react";
import { VisualizadorPDF } from "@/components/organismos/PDFVisualizer";
import { ReportTemplate } from "@/components/templates/Report";
import { ReportCard } from "@/components/molecules/ReportCard";
import { useUsuario } from "@/hooks/Usuarios/useUsuario";
import { User } from "@/schemas/User";
import { useRol } from "@/hooks/Roles/useRol";

export default function UserReportSelector() {
  const { users } = useUsuario();
  const { roles } = useRol();

  const [fechaInicio, setFechaInicio] = useState<string>("");
  const [fechaFin, setFechaFin] = useState<string>("");
  const [selectedReport, setSelectedReport] = useState<string | null>(null);

  if (!roles) return <p>Cargando roles...</p>;
  if (!users) return <p>Cargando...</p>;


  const filtrarPorFechas = (
    data: User[],
    fechaInicio: string,
    fechaFin: string
  ) => {
    if (!fechaInicio || !fechaFin) return [];
    const from = new Date(`${fechaInicio}T00:00:00`);
    const to = new Date(`${fechaFin}T23:59:59`);
    return data.filter((usuario) => {
        const fecha = new Date(usuario.created_at);
        return fecha >= from && fecha <= to;
    });
  };

  const formatFecha = (fecha: string) => {
    const d = new Date(fecha);
    d.setHours(d.getHours() + 5);
    return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
};

  const dataPorFecha = filtrarPorFechas(users, fechaInicio, fechaFin);

  const reports = [
    {
      id: "todos",
      title: "Usuarios Registrados",
      description: (data: User[], inicio?: string, fin?: string) => {
        const total = data.length;
        const activos = data.filter((e) => e.estado).length;
        const rango =
          inicio && fin
            ? `Fecha: ${formatFecha(inicio)} al ${formatFecha(fin)}.`
            : "";
        return `
${rango}

En el presente reporte se presenta un resumen general de los usuarios registrados en el sistema, mostrando información relevante como su nombre, correo electrónico y fecha de registro.

Es importante llevar un control detallado de los usuarios ya que ellos son quienes interactúan directamente con las funcionalidades del sistema. Su gestión adecuada garantiza un mejor manejo de accesos, trazabilidad y soporte.

Hasta el momento, se han registrado un total de ${total} usuarios.
De ellos, ${activos} se encuentran activos actualmente.

A continuación se muestra una tabla con los datos de los usuarios registrados:`;
      },
      accessors: ["nombre", "created_at"],
      headers: ["Nombre", "Fecha de creación"],
      withTable: true,
      filterFn: (data: User[]) => data,
    },
    {
      id: "Activos",
      title: "Usuarios Activos",
      description: (data: User[], inicio?: string, fin?: string) => {
        const activos = data.filter((e) => e.estado);
        const total = activos.length;
        const rango =
          inicio && fin
            ? `Fecha: ${formatFecha(inicio)} al ${formatFecha(fin)}.`
            : "";
        return `
${rango}

En todo sistema, es común que algunos usuarios permanezcan inactivos por diversas razones, como la finalización de sus labores, falta de uso prolongado o suspensión temporal del acceso.

Llevar un control sobre estos estados es fundamental para mantener la seguridad y la integridad de la plataforma, evitando accesos innecesarios o no autorizados.

Actualmente hay ${total} usuarios con estado activo..

Este reporte permite identificar cuántos usuarios están participando activamente en el sistema.`;
      },
      accessors: ["nombre", "valor", "created_at"],
      headers: ["Nombre", "Valor", "Fecha de creación"],
      withTable: true,
      filterFn: (data: User[]) => data.filter((u) => u.estado),
    },
    {
      id: "Inactivos",
      title: "Usuarios Inactivos",
      description: (data: User[], inicio?: string, fin?: string) => {
        const inactivos = data.filter((e) => !e.estado).length;
        const rango =
          inicio && fin
            ? `Fecha: ${formatFecha(inicio)} al ${formatFecha(fin)}.`
            : "";
        return `
${rango}

En todo sistema, es común que algunos usuarios permanezcan inactivos por diversas razones, como la finalización de sus labores, falta de uso prolongado o suspensión temporal del acceso.

Llevar un control sobre estos estados es fundamental para mantener la seguridad y la integridad de la plataforma, evitando accesos innecesarios o no autorizados.

Actualmente hay un total de ${inactivos} usuarios inactivos.

Este reporte permite identificar cuántos necesitan reactivación o eliminación definitiva.`;
      },
      accessors: ["nombre", "valor", "created_at"],
      headers: ["Nombre", "Valor", "Fecha de creación"],
      withTable: true,
      filterFn: (data: User[]) => data.filter((e) => !e.estado),
    },
    {
      id: "Roles",
      title: "Usuarios por rol",
      description: (data: User[], inicio?: string, fin?: string) => {
        const conteoPorRol: Record<number, number> = {};
        data.forEach((usuario) => {
          if (!usuario.fk_rol) return;
          const rolId = Number(usuario.fk_rol);
          conteoPorRol[rolId] = (conteoPorRol[rolId] || 0) + 1;
        });
        const resumen = roles
          .map((rol) => {
            const cantidad = conteoPorRol[rol.id_rol] || 0;
            return `- ${rol.nombre}: ${cantidad} usuario(s)`;
          })
          .join("\n");
        const rango =
          inicio && fin
            ? `Fecha: ${formatFecha(inicio)} al ${formatFecha(fin)}.`
            : "";
        return `
${rango}

Este reporte muestra la cantidad de usuarios agrupados por su rol en el sistema.

Resumen:
${resumen}
        `;
      },
      accessors: ["nombre", "created_at", "rol_nombre"],
      headers: ["Nombre", "Fecha de creación", "Rol"],
      withTable: true,
      filterFn: (data: User[]) =>
        data.map((user) => ({
          ...user,
          rol_nombre:
            roles?.find((r) => r.id_rol === user.fk_rol)?.nombre ||
            "Rol desconocido",
        })),
    },
  ];

  const selected = reports.find((r) => r.id === selectedReport);
  const handleBack = () => setSelectedReport(null);

  if (selectedReport && selected) {
    const dataPorFecha = filtrarPorFechas(users, fechaInicio, fechaFin);
    const dataFiltrada = selected.filterFn(dataPorFecha).map((item) => ({
      ...item,
      created_at: formatFecha(item.created_at),
    }));

    return (
      <VisualizadorPDF
        onBack={handleBack}
        component={
          <ReportTemplate
            title={selected.title}
            description={selected.description(
              dataFiltrada,
              fechaInicio,
              fechaFin
            )}
            headers={
              selected.withTable && selected.headers ? selected.headers : []
            }
            accessors={
              selected.withTable && selected.accessors
                ? selected.accessors
                : []
            }
            data={selected.withTable ? dataFiltrada : []}
          />
        }
      />
    );
  }

  return (
    <>
      <div className="p-4">
        <div className="flex justify-center">
          <div className="grid xl:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-center font-medium">
                Fecha de inicio
              </label>
              <input
                type="date"
                className="w-full border rounded p-2"
                value={fechaInicio}
                onChange={(e) => setFechaInicio(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm text-center font-medium">
                Fecha de fin
              </label>
              <input
                type="date"
                className="w-full border rounded p-2"
                value={fechaFin}
                onChange={(e) => setFechaFin(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {fechaInicio && fechaFin ? (
        <div className="flex ml-12 mr-12 gap-4 grid xl:grid-cols-3">
          {reports.map((r) => (
            <ReportCard
              key={r.id}
              title={r.title}
              description={r.description(r.filterFn(dataPorFecha))}
              onClick={() => setSelectedReport(r.id)}
            />
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-center">
          Selecciona un rango de fechas para ver los reportes disponibles.
        </p>
      )}
    </>
  );
}
