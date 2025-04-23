  import { useState } from "react";
  import { VisualizadorPDF } from "@/components/organismos/PDFVisualizer";
  import { ReportTemplate } from "@/components/templates/Report";
  import { ReportCard } from "@/components/molecules/ReportCard";
  import { useRol } from "@/hooks/Roles/useRol";
  import { Rol } from "@/types/Rol";

  export default function RolReportSelector() {
    const { roles } = useRol();
    const [fechaInicio, setFechaInicio] = useState<string>("");
    const [fechaFin, setFechaFin] = useState<string>("");
    const [selectedReport, setSelectedReport] = useState<string | null>(null);

    if (!roles) return <p>Cargando...</p>;

    const filtrarPorFechas = (
      data: Rol[],
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
      const month = String(date.getMonth() + 1).padStart(2, "0"); // +1 porque los meses van de 0 a 11
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    };
    

    const dataPorFecha = filtrarPorFechas(roles, fechaInicio, fechaFin);

    const reports = [
      {
        id: "todos",
        title: "Roles Registrados",
        description: (data: Rol[], inicio?: string, fin?: string) => {
          const total = data.length;
          const activos = data.filter((e) => e.estado).length;
          const rango =
            inicio && fin
              ? `Fecha: ${formatFecha(inicio)} al ${formatFecha(fin)}.`
              : "";
          return `
  ${rango}

  Los roles son muy importantes puesto que gacias ellos el usario va apoder tener el acceso a ciertos modulos de nuestro sistema, es decir que de aqui pparte sobre a que opciones puede acceder en nusetro software.

  Si bien es cierto algunos de nuestro roles deben darsel ciertos permisos, ya que gracias a ello es que pueden acceder alos modulos correspondeintes.

  Se han registrado un total de ${total} roles.
  De ellos, ${activos} están activos actualmente.

  Este reporte brinda una visión general del total de roles registrados en el sistema.`;
        },
        accessors: ["nombre", "created_at"],
        headers: ["Nombre", "Fecha de creación"],
        withTable: true,
        filterFn: (data: Rol[]) => data,
      },
      {
        id: "activos e inactivos",
        title: "Roles Activos e Inactivos",
        description: (data: Rol[]) => {
          const activos = data.filter((e) => e.estado);
          const inactivos = data.filter((e) => !e.estado).length;
          const total = activos.length;
          return `
  Tenemos entre la garn variedad de roles no siempre todos van a estar activos hay algunas ocasiones en las que por motivos de no implementar mas un rol que se deciden llevar acabo el proceso de desactivacion bien sea que por el momento ya no hay usuarios con ese rol o que posiblemente no se vilvera a usar mas

  Actualmente hay ${total} roles con estado activo y ${inactivos} de ellos esta inactivado.

  Estos roles representan los recursos disponibles y operativos dentro del sistema.`;
        },
        accessors: ["nombre", "valor", "created_at"],
        headers: ["Nombre", "Valor", "Fecha de creación"],
        withTable: true,
        filterFn: (data: Rol[]) => data.filter((e) => e.estado),
      },
      {
        id: "",
        title: "",
        description: (data: Rol[]) => {
          return `hola`;
        },
        withTable: false,
        filterFn: (data: Rol[]) => data,
      },
    ];

    const selected = reports.find((r) => r.id === selectedReport);
    const handleBack = () => setSelectedReport(null);

    if (selectedReport && selected) {
      const dataPorFecha = filtrarPorFechas(roles, fechaInicio, fechaFin);
      const dataFiltrada = selected.filterFn(dataPorFecha).map((item) => ({
        ...item,
        created_at: formatFecha(item.created_at),
      }));

      return (
        <VisualizadorPDF
          onBack={handleBack}
          component={
            <ReportTemplate
              title={`${selected.title}`}
              description={selected.description(
                dataFiltrada,
                fechaInicio,
                fechaFin
              )}
              headers={
                selected.withTable && selected.headers ? selected.headers : []
              }
              accessors={
                selected.withTable && selected.accessors ? selected.accessors : []
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
            <div className="grid  xl:grid-cols-2 gap-4">
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
                <label className="block text-sm text-center font-medium">Fecha de fin</label>
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
          <div className="flex ml-12 mr-12 gap-4  grid xl:grid-cols-3">
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
