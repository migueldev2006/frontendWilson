import { useState } from "react";
import { useFichas } from "@/hooks/fichas/useFichas";
import { VisualizadorPDF } from "@/components/organismos/PDFVisualizer";
import { ReportTemplate } from "@/components/templates/Report";
import { ReportCard } from "@/components/molecules/ReportCard";
import { Ficha  } from "@/types/Ficha";

export default function ReportFichas() {
  const { fichas } = useFichas();
  const [fechaInicio, setFechaInicio] = useState<string>("");
  const [fechaFin, setFechaFin] = useState<string>("");
  const [selectedReport, setSelectedReport] = useState<string | null>(null);

  if (!fichas) return <p>Cargando...</p>;
  const filtrarPorFechas = (
      data: Ficha[],
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
    const dataPorFecha = filtrarPorFechas(fichas, fechaInicio, fechaFin);
  const reports = [
    {
      id: "todos",
      title: "REPORTE GENERAL DE FICHAS REGISTRADAS - SGDSS Sede Yamboro",
      description: (data: Ficha [],inicio: string, fin: string) => {
        const total = data.length;
        const activos = data.filter((e) => e.estado).length;
        const rango =
        inicio && fin
          ? `Fecha: ${formatFecha(inicio)} al ${formatFecha(fin)}.`
          : "";
      return `
${rango}
Se han registrado un total de ${total} fichas.
De ellos, ${activos} están activos actualmente.

Resumen General:

Hasta la fecha, el sistema SGDSS cuenta con un total de 2 fichas registradas en la sede Yamboro, de las cuales 1 se encuentra activa actualmente. Este registro es reflejo de la gestión continua de los grupos de formación y su vinculación con los diferentes programas académicos.


Importancia del Registro:

-El mantenimiento actualizado de las fichas es fundamental para:

-Garantizar la correcta trazabilidad de movimientos, asignaciones y uso de materiales.

-Asociar cada ficha a su respectivo programa de formación.

-Facilitar la planificación, ejecución y seguimiento de actividades dentro de la sede.

-Asegurar la transparencia y el control sobre los recursos académicos y logísticos.`;
      },
      accessors: ["codigo_ficha", "fk_programa", "created_at"],
      headers: ["codigo_ficha   ", "programa", "Fecha de creación"],
      withTable: true,
      filterFn: (data: Ficha []) => data,
    },
    {
      id: "activos",
      title: "REPORTE DE FICHAS ACTIVAS – SGDSS Sede Yamboro",
      description: (data: Ficha [],inicio: string, fin: string) => {
        const activos = data.filter((e) => e.estado);
        const total = activos.length;
        const rango =
        inicio && fin
          ? `Fecha: ${formatFecha(inicio)} al ${formatFecha(fin)}.`
          : "";
      return `
${rango}
El presente informe tiene como objetivo presentar un panorama actualizado sobre las fichas activas registradas en el sistema SGDSS de la sede Yamboro. Las fichas constituyen un eje central en la trazabilidad de materiales, ya que agrupan a los aprendices y están directamente relacionadas con las áreas, elementos y programas de formación

Las fichas activas permiten relacionar:

-Materiales entregados por programa y grupo.

-Movimientos de inventario asociados a fechas específicas.

-Responsables de entrega y recepción de materiales.

Una adecuada gestión de fichas contribuye al fortalecimiento del control logístico de recursos de formación, garantiza transparencia, y permite generar históricos precisos de consumo y uso de materiales.

.

Actualmente hay ${total} areas con estado activo.`;
      },
      accessors: ["codigo_ficha", "fk_programa", "created_at"],
      headers: ["codigo_ficha   ", "programa", "Fecha de creación"],
      withTable: true,
      filterFn: (data: Ficha []) => data.filter((e) => e.estado),
      
    },
  
    {
      id: "id_area",
      title: "REPORTE DE FICHAS INACTIVAS - SGDSS Sede Yamboro",
      description: (data: Ficha [],inicio: string, fin: string) => {
        const inactivos = data.filter((e) => !e.estado).length;
        const rango =
        inicio && fin
          ? `Fecha: ${formatFecha(inicio)} al ${formatFecha(fin)}.`
          : "";
      return `
${rango}
Se han encontrado ${inactivos} ficha/s con estado inactivo.

Resumen Ejecutivo:
Se ha identificado un total de 1 ficha con estado inactivo dentro del sistema de gestión SGDSS correspondiente a la sede Yamboro. Estas fichas, al no encontrarse activas, requieren verificación para determinar si deben ser reactivadas, archivadas o depuradas del sistema

Importancia del Registro:
La gestión adecuada de las fichas es crucial para asegurar la correcta trazabilidad de los procesos formativos, el seguimiento de los programas asociados y la distribución efectiva de recursos materiales. Por ello, mantener actualizada esta información es esencial para la toma de decisiones y planificación operativa..

Observaciones Relevantes:

-Las fichas inactivas podrían representar procesos formativos finalizados, cancelados o en pausa.

-Se recomienda una revisión periódica del estado de cada ficha, en conjunto con los responsables de programa.

-La depuración de registros inactivos mejora la eficiencia del sistema y reduce posibles errores administrativos.


`;
      },
      accessors: ["codigo_ficha", "fk_programa", "created_at"],
      headers: ["codigo_ficha   ", "programa", "Fecha de creación"],
      withTable: true,
      filterFn: (data: Ficha []) => data.filter((e) => !e.estado),
    },
    {
      id: "nuevos",
      title: "REPORTE MENSUAL – NUEVAS FICHAS REGISTRADAS en el SGDSS  Sede Yamboro",
      description: (data: Ficha []) => {
        const now = new Date();
        const delMes = data.filter((e) => {
          const created = new Date(e.created_at);
          return (
            created.getMonth() === now.getMonth() &&
            created.getFullYear() === now.getFullYear()
          );
        }).length;

        return `
Este mes se han registrado ${delMes} nuevas fichas.

Resumen del Registro:

Durante el presente mes, se han registrado un total de 2 nuevas fichas en el sistema SGDSS correspondiente a la sede Yamboro. Este crecimiento refleja el avance en la planificación de programas formativos y el fortalecimiento del control administrativo.

Importancia del Registro:

El ingreso oportuno de nuevas fichas permite una adecuada asignación de materiales, control de inventarios y planificación de recursos logísticos, siendo un pilar clave para la trazabilidad de procesos educativos dentro de la sede.


`;


      },
      accessors: ["codigo_ficha", "fk_programa", "created_at"],
      headers: ["codigo_ficha   ", "programa", "Fecha de creación"],
      withTable: true,
      filterFn: (data: Ficha []) => data, 
    },
    
  ];
  
  const selected = reports.find((r) => r.id === selectedReport);
  const handleBack = () => setSelectedReport(null);

  if (selectedReport && selected) {
    const dataPorFecha = filtrarPorFechas(fichas, fechaInicio, fechaFin);
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
