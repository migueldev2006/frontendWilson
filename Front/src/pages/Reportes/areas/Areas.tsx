import { useState } from "react";
import { useAreas } from "@/hooks/areas/useAreas";
import { VisualizadorPDF } from "@/components/organismos/PDFVisualizer";
import { ReportTemplate } from "@/components/templates/Report";
import { ReportCard } from "@/components/molecules/ReportCard";
import { Area  } from "@/types/area";

export default function ReportArea() {
  const { areas } = useAreas();
  const [fechaInicio, setFechaInicio] = useState<string>("");
  const [fechaFin, setFechaFin] = useState<string>("");
  const [selectedReport, setSelectedReport] = useState<string | null>(null);

  if (!areas) return <p>Cargando...</p>;
  const filtrarPorFechas = (
      data: Area[],
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
    
  
    const dataPorFecha = filtrarPorFechas(areas, fechaInicio, fechaFin);
  
  const reports = [
    {
      id: "todos",
      title: "REPORTE GENERAL DE ÁREAS REGISTRADAS - SGDSS Sede Yamboro",
      description: (data: Area[], inicio: string, fin: string) => {
        const total = data.length;
        const activos = data.filter((e) => e.estado).length;
        const rango =
        inicio && fin
          ? `Fecha: ${formatFecha(inicio)} al ${formatFecha(fin)}.`
          : "";
      return `
${rango}
Se han registrado un total de ${total} areas.
De ellos, ${activos} están activos actualmente.

Resumen General
Actualmente, el sistema cuenta con un total de 8 áreas registradas, de las cuales 3 se encuentran activas.
Este informe proporciona una visión integral de todas las áreas registradas en el SGDSS, junto con el nombre de las personas responsables y las fechas de creación respectivas. Esta información es clave para la correcta administración de espacios, la asignación de materiales y el seguimiento de trazabilidad dentro de la sede.

Observaciones Relevantes

-El registro de áreas está alineado con los esfuerzos por mejorar la trazabilidad de materiales y la asignación eficiente de recursos.

-Se recomienda revisar aquellas áreas cuyos nombres puedan sugerir uso de prueba (como "prueva") para mantener integridad en los datos.

-La identificación clara de responsables permite una mejor gestión y seguimiento de actividades dentro de cada área.`;
      },
      accessors: ["nombre", "persona_encargada", "created_at"],
      headers: ["Nombre", "persona_encargada", "Fecha de creación"],
      withTable: true,
      filterFn: (data: Area []) => data,
    },
    {
      id: "activos",
      title: "REPORTE DE ÁREAS ACTIVAS – SGDSS Sede Yamboro",
      description: (data: Area [],inicio: string, fin: string) => {
        const activos = data.filter((e) => e.estado);
        const total = activos.length;
        const rango =
        inicio && fin
          ? `Fecha: ${formatFecha(inicio)} al ${formatFecha(fin)}.`
          : "";
      return `
${rango}
Actualmente hay ${total} areas con estado activo.

Resumen General
Actualmente, se encuentran 3 áreas en estado activo dentro del sistema SGDSS – sede Yamboro. Estas áreas representan espacios habilitados y disponibles para la gestión, almacenamiento o uso de materiales de formación.

El registro y monitoreo de estas áreas activas es esencial para mantener la trazabilidad y asegurar el correcto flujo de elementos dentro de los programas de formación.

Observaciones Relevantes

-Estas áreas están actualmente habilitadas para operaciones, lo que significa que cualquier movimiento de materiales dentro de ellas se encuentra trazado.

-Se recomienda mantener actualizada esta información para reflejar fielmente el estado operativo de los espacios.

-La correcta identificación de las áreas activas mejora la logística y la toma de decisiones en la administración de recursos.`;
      },
      accessors: ["nombre",  "created_at"],
      headers: ["Nombre",  "Fecha de creación"],
      withTable: true,
      filterFn: (data: Area []) => data.filter((e) => e.estado),
    },
    {
      id: "id_area",
      title: "REPORTE DE ÁREAS INACTIVAS - SGDSS Sede Yamboro",
      description: (data: Area [],inicio: string, fin: string) => {
        const inactivos = data.filter((e) => !e.estado).length;
        const rango =
        inicio && fin
          ? `Fecha: ${formatFecha(inicio)} al ${formatFecha(fin)}.`
          : "";
      return `
${rango}
Se han encontrado ${inactivos} areas con estado inactivo.

Resumen General
Durante el periodo actual, se han identificado 5 áreas con estado inactivo dentro del sistema de gestión del SGDSS. Estas áreas actualmente no se encuentran en funcionamiento y requieren una evaluación para determinar su pertinencia en el inventario de trazabilidad de materiales.

La presencia de áreas inactivas puede afectar la integridad del seguimiento de elementos y materiales de formación. Por ello, es recomendable analizar cada una para definir si deben ser reactivadas o depuradas del sistema, en caso de que no tengan uso operativo o funcionalidad prevista.

Observaciones Relevantes

-Algunas áreas, como “adso”, podrían estar asociadas a programas de formación, lo cual sugiere la necesidad de validarlas antes de su reactivación o eliminación.

-Se identifican nombres con apariencia de prueba (por ejemplo: “prueva”), lo que indica que podrían haber sido creadas con fines de testeo. Estas deben ser depuradas si no cumplen una función activa.

-La depuración y correcta activación de estas áreas mejora la trazabilidad y evita posibles errores en la asignación o seguimiento de materiales.`;
      },
      accessors: ["nombre",  "created_at"],
      headers: ["Nombre",  "Fecha de creación"],
      withTable: true,
      filterFn: (data: Area []) => data.filter((e) => !e.estado),
    },
    {
      id: "nuevos",
      title: "REPORTE MENSUAL – NUEVAS ÁREAS REGISTRADAS en el SGDSS  Sede Yamboro",
      description: (data: Area [],inicio: string, fin: string) => {
        const now = new Date();
        const delMes = data.filter((e) => {
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
Este mes se han registrado ${delMes} nuevas Areas.


Como parte del proceso de fortalecimiento en la trazabilidad de materiales de formación, este mes se han integrado 8 nuevas áreas al sistema SGDSS de la sede Yamboro. Estas áreas representan espacios clave donde se gestionan, almacenan o utilizan materiales de formación, por lo tanto, su seguimiento es fundamental para mantener la integridad y la trazabilidad del inventario.

El crecimiento en el número de áreas permite ampliar el alcance del sistema de trazabilidad, facilitando una mejor identificación de flujos, movimientos y almacenamiento de elementos.

Observaciones Relevantes:
-Las áreas como “adso”, “TICC” y “gastronomía” están posiblemente vinculadas a programas de formación, por lo que es importante asociar correctamente los materiales a estas.

-Se identifican nombres de prueba como "prueva", lo que sugiere que parte de las áreas podrían haber sido creadas para fines de testeo. Se recomienda su revisión y eventual depuración si no tienen uso operativo.

-El registro oportuno de estas áreas permite integrar su trazabilidad desde el primer momento, asegurando que cualquier movimiento de materiales quede documentado correctamente en el sistema.`;


      },
      accessors: ["nombre",  "created_at"],
      headers: ["Nombre",  "Fecha de creación"],
      withTable: true,
      filterFn: (data: Area []) => data, // no es necesaria una tabla
    },
    
  ];
  
  const selected = reports.find((r) => r.id === selectedReport);
  const handleBack = () => setSelectedReport(null);

  if (selectedReport && selected) {
    const dataPorFecha = filtrarPorFechas(areas, fechaInicio, fechaFin);
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
            description={selected.description(dataFiltrada,fechaInicio, fechaFin)}
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
