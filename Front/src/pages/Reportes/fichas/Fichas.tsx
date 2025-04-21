import { useState } from "react";
import { useFichas } from "@/hooks/fichas/useFichas";
import { VisualizadorPDF } from "@/components/organismos/PDFVisualizer";
import { ReportTemplate } from "@/components/templates/Report";
import { ReportCard } from "@/components/molecules/ReportCard";
import { Ficha  } from "@/types/Ficha";

export default function ReportFichas() {
  const { fichas } = useFichas();
  const [selectedReport, setSelectedReport] = useState<string | null>(null);

  if (!fichas) return <p>Cargando...</p>;

  const reports = [
    {
      id: "todos",
      title: "REPORTE GENERAL DE FICHAS REGISTRADAS - SGDSS Sede Yamboro",
      description: (data: Ficha []) => {
        const total = data.length;
        const activos = data.filter((e) => e.estado).length;
        return `
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
      description: (data: Ficha []) => {
        const activos = data.filter((e) => e.estado);
        const total = activos.length;
        return `
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
      description: (data: Ficha []) => {
        const inactivos = data.filter((e) => !e.estado).length;
        return `
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
    const dataFiltrada = selected.filterFn(fichas);

    return (
      <VisualizadorPDF
        onBack={handleBack}
        component={
          <ReportTemplate
            title={selected.title}
            description={selected.description(dataFiltrada)}
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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
      {reports.map((r) => (
        <ReportCard
          key={r.id}
          title={r.title}
          description={
            typeof r.description === "function" ? r.description(fichas) : ""
          }
          onClick={() => setSelectedReport(r.id)}
        />
      ))}
    </div>
  );
}
