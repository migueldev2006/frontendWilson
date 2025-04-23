import { useState } from "react";
import { useRolModulo } from "@/hooks/rolModulo/useRolModulo";
import { VisualizadorPDF } from "@/components/organismos/PDFVisualizer";
import { ReportTemplate } from "@/components/templates/Report";
import { ReportCard } from "@/components/molecules/ReportCard";
import { RolModulo } from "@/types/rolModulo";

export default function ReportRolModulo() {
  const { rolModulos } = useRolModulo();
  const [fechaInicio, setFechaInicio] = useState<string>("");
  const [fechaFin, setFechaFin] = useState<string>("");
  const [selectedReport, setSelectedReport] = useState<string | null>(null);

  if (!rolModulos) return <p>Cargando...</p>;

  const filtrarPorFechas = (
    data: RolModulo[],
    fechaInicio: string,
    fechaFin: string
  ) => {
    if (!fechaInicio || !fechaFin) return [];
    const inicio = new Date(fechaInicio);
    const fin = new Date(fechaFin);
    return data.filter((rol) => {
      const fecha = new Date(rol.created_at);
      return fecha >= inicio && fecha <= fin;
    });
  };

  const formatFecha = (fecha: string) => {
    const date = new Date(fecha);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const dataPorFecha = filtrarPorFechas(rolModulos, fechaInicio, fechaFin);

  const reports = [
    {
      id: "todos",
      title: "REPORTE GENERAL DE RELACIONES ROL-MÓDULO - SGDSS Sede Yamboro",
      description: (data: RolModulo[], inicio: string, fin: string) => {
        const total = data.length;
        const rango =
          inicio && fin
            ? `Fecha: ${formatFecha(inicio)} al ${formatFecha(fin)}.`
            : "";
        return `
${rango}
Se han registrado un total de ${total} relaciones entre roles, módulos y permisos.

Resumen General
Este reporte detalla todas las asociaciones entre roles, módulos y permisos que existen actualmente en el sistema SGDSS. Estas relaciones permiten gestionar el acceso y las funcionalidades disponibles para cada perfil de usuario, garantizando un control adecuado del sistema.

Observaciones Relevantes

- Es importante verificar que cada relación tenga sentido en el contexto del flujo de trabajo.
- Las asociaciones deben mantenerse actualizadas conforme cambian las funciones o los permisos disponibles.
- El control granular de permisos mejora la seguridad y operatividad del sistema.
`;
      },
      accessors: ["fk_rol", "fk_modulo", "fk_permiso", "created_at"],
      headers: ["ID Rol", "ID Módulo", "ID Permiso", "Fecha de creación"],
      withTable: true,
      filterFn: (data: RolModulo[]) => data,
    },
    {
      id: "nuevos",
      title: "REPORTE MENSUAL – NUEVAS RELACIONES ROL-MÓDULO EN EL SGDSS",
      description: (data: RolModulo[], inicio: string, fin: string) => {
        const now = new Date();
        const nuevos = data.filter((e) => {
          const created = new Date(e.created_at);
          return (
            created.getMonth() === now.getMonth() &&
            created.getFullYear() === now.getFullYear()
          );
        }).length;

        const rango =
          inicio && fin
            ? `Fecha: ${formatFecha(inicio)} al ${formatFecha(fin)}.`
            : "";

        return `
${rango}
Este mes se han registrado ${nuevos} nuevas relaciones entre roles y módulos.

Resumen General
Durante el presente mes, se han integrado nuevas relaciones que definen el acceso a funcionalidades específicas por parte de los distintos roles de usuario. Esto permite una gestión dinámica y adaptable del sistema.

Observaciones Relevantes:

- Asegurarse de validar cada relación con los responsables de permisos del sistema.
- Mantener un historial de cambios podría ser útil para auditorías o revisiones de seguridad.
`;
      },
      accessors: ["fk_rol", "fk_modulo", "fk_permiso", "created_at"],
      headers: ["ID Rol", "ID Módulo", "ID Permiso", "Fecha de creación"],
      withTable: true,
      filterFn: (data: RolModulo[]) => data,
    },
  ];

  const selected = reports.find((r) => r.id === selectedReport);
  const handleBack = () => setSelectedReport(null);

  if (selectedReport && selected) {
    const dataFiltrada = selected
      .filterFn(dataPorFecha)
      .map((item) => ({
        ...item,
        fk_rol: Number(item.fk_rol),  // Convierte el fk_rol a number
        fk_modulo: Number(item.fk_modulo),  // Convierte el fk_modulo a number
        fk_permiso: Number(item.fk_permiso),  // Convierte el fk_permiso a number
        created_at: formatFecha(item.created_at),
      }));

    return (
      <VisualizadorPDF
        onBack={handleBack}
        component={
          <ReportTemplate
            title={selected.title}
            description={selected.description(dataFiltrada, fechaInicio, fechaFin)}
            headers={selected.withTable ? selected.headers : []}
            accessors={selected.withTable ? selected.accessors : []}
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
              description={r.description(r.filterFn(dataPorFecha), fechaInicio, fechaFin)}
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
