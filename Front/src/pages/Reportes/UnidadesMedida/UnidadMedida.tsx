import { useState } from "react";
import { VisualizadorPDF } from "@/components/organismos/PDFVisualizer";
import { ReportTemplate } from "@/components/templates/Report";
import { ReportCard } from "@/components/molecules/ReportCard";
import { useUnidad } from "@/hooks/UnidadesMedida/useUnidad";
import { Unidad } from "@/types/Unidad";

export default function UnidadReportSelector() {
  const { unidades } = useUnidad();
  const [selectedReport, setSelectedReport] = useState<string | null>(null);

  if (!unidades) return <p>Cargando...</p>;

  const reports = [
    {
      id: "todos",
      title: "Unidades de Medida Registradas",
      description: (data: Unidad[]) => {
        const total = data.length;
        return `
      Las unidades de medida constituyen un componente esencial dentro de los procesos de gestión de inventario y control logístico en cualquier organización. Su función principal es garantizar la uniformidad y coherencia en la cuantificación de los recursos, facilitando así la interpretación precisa de los datos asociados a entradas, salidas y movimientos de elementos.
      
      En el contexto del presente sistema, las unidades de medida permiten estandarizar cómo se representa la cantidad de los bienes registrados, ya sea en peso (kilogramos), volumen (litros), longitud (metros), unidades individuales (piezas) u otros formatos. Esta estandarización es fundamental para mantener la integridad de la información a lo largo de todo el ciclo de vida de los elementos, desde su ingreso hasta su eventual salida o baja.
      
      Además, la implementación adecuada de unidades de medida contribuye significativamente a reducir errores humanos, mejorar la trazabilidad de los recursos y optimizar la toma de decisiones en áreas como compras, almacenamiento, distribución y auditorías.
      
      Actualmente, el sistema cuenta con un total de ${total} unidad${total === 1 ? "" : "es"} de medida registrad${total === 1 ? "a" : "as"}, lo que demuestra un esfuerzo continuo por establecer una base sólida para la gestión estructurada del inventario institucional.
      
      A continuación, se presenta un listado general de las unidades de medida registradas, junto con la fecha correspondiente de su incorporación al sistema.
        `;
      },
      accessors: ["nombre", "created_at"],
      headers: ["Nombre", "Fecha de creación"],
      withTable: true,
      filterFn: (data: Unidad[]) => data,
    },
  ];

  const selected = reports.find((r) => r.id === selectedReport);
  const handleBack = () => setSelectedReport(null);

  if (selectedReport && selected) {
    const dataFiltrada = selected.filterFn(unidades);

    return (
      <VisualizadorPDF
        onBack={handleBack}
        component={
          <ReportTemplate
            title={selected.title}
            description={selected.description(dataFiltrada)}
            headers={selected.headers}
            accessors={selected.accessors}
            data={dataFiltrada}
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
            typeof r.description === "function"
              ? r.description(unidades)
              : ""
          }
          onClick={() => setSelectedReport(r.id)}
        />
      ))}
    </div>
  );
}
