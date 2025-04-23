import { useState } from "react";
import { VisualizadorPDF } from "@/components/organismos/PDFVisualizer";
import { ReportTemplate } from "@/components/templates/Report";
import { ReportCard } from "@/components/molecules/ReportCard";
import { useInventario } from "@/hooks/Inventarios/useInventario";
import { Inventario } from "@/types/Inventario";
import { useSitios } from "@/hooks/sitios/useSitios";
import { useElemento } from "@/hooks/Elementos/useElemento";

export default function ReportInventario() {
  const { inventarios } = useInventario();
  const {sitios} = useSitios()
  const {elementos} = useElemento()
  const [fechaInicio, setFechaInicio] = useState<string>("");
  const [fechaFin, setFechaFin] = useState<string>("");
  const [selectedReport, setSelectedReport] = useState<string | null>(null);

  if (!inventarios) return <p>Cargando...</p>;

  const filtrarPorFechas = (
    data: Inventario[],
    fechaInicio: string,
    fechaFin: string
  ) => {
    if (!fechaInicio || !fechaFin) return [];
    const inicio = new Date(fechaInicio);
    const fin = new Date(fechaFin);
    return data.filter((inventario) => {
      const fecha = new Date(inventario.created_at);
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
  

  const dataPorFecha = filtrarPorFechas(inventarios, fechaInicio, fechaFin);

  const reports = [
    {
      id: "sitios-mayor-inventario",
      title: "Sitios con Mayor Cantidad de Inventario",
      description: (inventarios: Inventario[], inicio?:string, fin?:string) => {
        const conteo: Record<number, number> = {};
        inventarios.forEach((inv) => {
          conteo[inv.fk_sitio] = (conteo[inv.fk_sitio] || 0) + inv.fk_elemento;
        });
    
        const top = Object.entries(conteo)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 3)
          .map(([id, total], i) => {
            const nombreSitio = sitios?.find((s) => s.id_sitio === Number(id))?.nombre ?? "Sitio desconocido";
            return `#${i + 1}: ${nombreSitio} - ${total} unidades`;
          });
    
          const rango =
          inicio && fin
            ? `Fecha: ${formatFecha(inicio)} al ${formatFecha(fin)}.`
            : "";

        return `
${rango}

    
Este informe presenta los sitios con mayor inventario total acumulado.
    
${top.join("\n")}
    
Este análisis puede ayudar a identificar centros de almacenamiento más cargados.`;
      },
      withTable: false,
      filterFn: (data: Inventario[]) => data,
    },
    {
      id: "inventarios-mayores-elementos",
      title: "Inventarios con Mayor Cantidad de Elementos",
      description: (inventarios: Inventario[], inicio:string, fin:string) => {
        const top = [...inventarios]
          .sort((a, b) => b.fk_elemento - a.fk_elemento)
          .slice(0, 5)
          .map((inv, i) => {
            const nombreElemento = elementos?.find((e) => e.id_elemento === inv.fk_elemento)?.nombre ?? "Elemento desconocido";
            const nombreSitio = sitios?.find((s) => s.id_sitio === inv.fk_sitio)?.nombre ?? "Sitio desconocido";
            return `#${i + 1}: ${nombreElemento} - ${inv.fk_elemento} unidades en ${nombreSitio}`;
          });
    
          const rango =
          inicio && fin
            ? `Fecha: ${formatFecha(inicio)} al ${formatFecha(fin)}.`
            : "";

        return `
${rango}

    
Estos son los inventarios con más unidades registradas (sin distinguir por tipo de stock):
    
${top.join("\n")}
    
Pueden representar los elementos más abastecidos en tu sistema.`;
      },
      withTable: false,
      filterFn: (data: Inventario[]) => data,
    },
    
    {
      id: "mayor-stock-elemento-sitio",
      title: "Mayor Stock Disponible por Elemento y Sitio",
      description: (inventarios: Inventario[], inicio?: string, fin?: string) => {
        const top = [...inventarios]
          .sort((a, b) => b.stock - a.stock)
          .slice(0, 5)
          .map((inv, i) => {
            const nombreElemento = elementos?.find((e) => e.id_elemento === inv.fk_elemento)?.nombre ?? "Elemento desconocido";
            const nombreSitio = sitios?.find((s) => s.id_sitio === inv.fk_sitio)?.nombre ?? "Sitio desconocido";
            return `#${i + 1}: ${nombreElemento} - ${inv.stock} disponibles en ${nombreSitio}`;
          });

          
          const rango =
          inicio && fin
            ? `Fecha: ${formatFecha(inicio)} al ${formatFecha(fin)}.`
            : "";

        return `
${rango}

    
    Este informe muestra los inventarios con mayor stock disponible (no comprometido).
    
    ${top.join("\n")}
    
    Esto permite identificar qué elementos están más disponibles en cada sitio.`;
      },
      withTable: false,
      filterFn: (data: Inventario[]) => data,
    },
    {
      id: "valor-economico-inventario",
      title: "Valor Económico del Inventario Disponible",
      description: (inventarios: Inventario[],inicio:string, fin:string) => {
        const valores: { nombre: string; costo: number; stock: number }[] = inventarios.map((inv) => {
          const elemento = elementos?.find((el) => el.id_elemento === inv.fk_elemento);
          const valor = elemento?.valor ?? 0;
          return {
            nombre: elemento?.nombre ?? "Elemento desconocido",
            costo: valor * inv.stock,
            stock: inv.stock,
          };
        });
    
        const totalGeneral = valores.reduce((acc, e) => acc + e.costo, 0);
        const promedio = valores.length ? totalGeneral / valores.length : 0;
    
        const top = [...valores].sort((a, b) => b.costo - a.costo)[0] ?? {
          nombre: "No disponible",
          costo: 0,
        };
        
    
        const rango =
          inicio && fin
            ? `Fecha: ${formatFecha(inicio)} al ${formatFecha(fin)}.`
            : "";

        return `
${rango}

    
Resumen Económico del Inventario
    
Valor total del inventario disponible: $${totalGeneral.toFixed(2)}
Elemento con mayor valor acumulado: ${top.nombre} ($${top.costo.toFixed(2)} en stock)
Valor promedio por tipo de elemento: $${promedio.toFixed(2)}
    
Este análisis ayuda a comprender el peso económico de los elementos actualmente disponibles en el sistema.  
Además, permite priorizar auditorías o verificaciones sobre elementos de mayor costo para evitar pérdidas o desbalances.
    
Este informe se genera con base en el valor monetario declarado en los elementos multiplicado por el stock actual en cada inventario.
    
Solo se consideran los inventarios con stock positivo.
        `;
      },
      withTable: true,
      accessors: ["nombre", "stock", "costo"],
      headers: ["Elemento", "Stock Disponible", "Valor Total"],
      filterFn: (inventarios: Inventario[]) => inventarios.filter((i) => i.stock > 0),
    }
  ];

  const selected = reports.find((r) => r.id === selectedReport);
  const handleBack = () => setSelectedReport(null);

  if (selectedReport && selected) {
    const dataPorFecha = filtrarPorFechas(inventarios, fechaInicio, fechaFin);
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
            description={selected.description(dataFiltrada,fechaInicio,fechaFin)}
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
        <div className="p-4 grid md:grid-cols-3 gap-4">
          {reports.map((r) => (
            <ReportCard
              key={r.id}
              title={r.title}
              description={r.description(r.filterFn(dataPorFecha),fechaInicio,fechaFin)}
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
