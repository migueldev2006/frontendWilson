import { useState } from "react";
import { useElemento } from "@/hooks/Elementos/useElemento";
import { VisualizadorPDF } from "@/components/organismos/PDFVisualizer";
import { ReportTemplate } from "@/components/templates/Report";
import { ReportCard } from "@/components/molecules/ReportCard";
import { Elemento } from "@/types/Elemento";
import { Categoria } from "@/types/Categorias";
import { Unidad } from "@/types/Unidad";
import { useUnidad } from "@/hooks/UnidadesMedida/useUnidad";
import { useCategoria } from "@/hooks/Categorias/useCategorias";
import { Caracteristica } from "@/types/Caracteristica";
import { useCaracteristica } from "@/hooks/Caracteristicas/useCaracteristicas";

export default function ReportElemento() {
  const { unidades } = useUnidad();
  const { categorias } = useCategoria();
  const { elementos } = useElemento();
  const {caracteristicas} = useCaracteristica()
  const [fechaInicio, setFechaInicio] = useState<string>("");
  const [fechaFin, setFechaFin] = useState<string>("");
  const [selectedReport, setSelectedReport] = useState<string | null>(null);

  if (!elementos) return <p>Cargando...</p>;

  const filtrarPorFechas = (
    data: Elemento[],
    fechaInicio: string,
    fechaFin: string
  ) => {
    if (!fechaInicio || !fechaFin) return [];
    const inicio = new Date(fechaInicio);
    const fin = new Date(fechaFin);
    return data.filter((elemento) => {
      const fecha = new Date(elemento.created_at);
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

  const dataPorFecha = filtrarPorFechas(elementos, fechaInicio, fechaFin);
  if (!elementos) return <p>Cargando...</p>;

  const reports = [
    {
      id: "todos",
      title: "Elementos Registrados",
      description: (
        data: Elemento[],
        inicio?:string,
        fin?:string
      ) => {
        const total = data.length;
        const activos = data.filter((e) => e.estado).length;
        const rango = inicio && fin ? `Fecha: ${formatFecha(inicio)} al ${formatFecha(fin)}.` : "";
    
        return `
    ${rango}

En el presente reporte vamos a dar a conocer la totalidad de los elemntos que se han registrado en el sistema dando a conocer su nombre, el costo que tuvo y la fecha en la cual fue registrado. 

Se han registrado un total de ${total} elementos. De ellos, ${activos} están activos actualmente.

Es importante conocer que los elementos registrados en el sistema pasan asignarse a un inventario en donde se establecera la cantidad a registar por cada uno de estos.
        
        A continuacion daremos a conocer la una tabla con los registros de los elemntos en el sistema:`;
      },
      accessors: ["nombre", "valor", "created_at"],
      headers: ["Nombre", "Valor", "Fecha de creación"],
      withTable: true,
      filterFn: (data: Elemento[]) => data,
    },
    {
      id: "activos",
      title: "Elementos Activos",
      description: (
        data: Elemento[],
        inicio?:string,
        fin?:string
      ) => {
        const activos = data.filter((e) => e.estado);
        const total = activos.length;
        const rango = inicio && fin ? `Fecha: ${formatFecha(inicio)} al ${formatFecha(fin)}.` : "";
    
        return `
    ${rango}
Actualmente hay ${total} elementos con estado activo.

La importancia de si estos elementos estan activados o no es muy importante puesto que podemos determinar en caso de caducar que el elemento ha sido desactivado del ineventario debido a que ha caducado o se ha agotado.

Por tal motivo se podria llegar a verificar que no hay cantidad alguna disponible en su momento y por lo tanto el elemento o material no estaria disponible en ninguna circunstancia.

Estos elementos representan los recursos disponibles y operativos dentro del sistema.`;
      },
      accessors: ["nombre", "valor", "created_at"],
      headers: ["Nombre", "Valor", "Fecha de creación"],
      withTable: true,
      filterFn: (data: Elemento[]) => data.filter((e) => e.estado),
    },
    {
      id: "sin_estado",
      title: "Elementos Inactivos",
      description: (data: Elemento[]) => {
        const inactivos = data.filter((e) => !e.estado).length;
        return `
Se han encontrado ${inactivos} elementos con estado inactivo.

Dado que hasta el momento no ha sido desactivado ningun elemento quiere decir que no se han agotado las reservas encontradas en el stock del inevntario y que aunsigue disponible.

Pero por otro lado eso solo da a entender que en el CGDSS se cuenta con los elemetos suficientes para el trabajo solicitados en las diferentes sedes

Es importante revisar estos registros para determinar si deben ser reactivados o dados de baja definitivamente.`;
      },
      withTable: false,
      filterFn: (data: Elemento[]) => data,
    },
    {
      id: "resumen-clasificacion-elementos",
      title: "Resumen de Clasificación de los Elementos",
      description: (
        data: Elemento[],
        inicio?:string,
        fin?:string
      ) => {
        const contar = <T,>(arr: T[]): Record<string, number> => {
          const freq: Record<string, number> = {};
          arr.forEach((item) => {
            const key = String(item);
            freq[key] = (freq[key] || 0) + 1;
          });
          return freq;
        };

        const catCount = contar(data.map((e) => e.fk_categoria));
        const topCategoriaId = Object.entries(catCount).sort(
          (a, b) => b[1] - a[1]
        )[0]?.[0];
        const topCategoriaNombre =
          categorias?.find((c) => c.id_categoria === Number(topCategoriaId))
            ?.nombre ?? "Desconocida";

        const unitCount = contar(data.map((e) => e.fk_unidad_medida));
        const topUnidadId = Object.entries(unitCount).sort(
          (a, b) => b[1] - a[1]
        )[0]?.[0];
        const topUnidadNombre =
          unidades?.find((u) => u.id_unidad === Number(topUnidadId))?.nombre ??
          "Desconocida";



        const allCaracts = data.flatMap((e) => e.fk_caracteristica ?? []);
        const caractCount = contar(allCaracts);
        const topCarac =
          Object.entries(caractCount).sort((a, b) => b[1] - a[1])[0]?.[0];
          const topCaracNombre =
          caracteristicas?.find((u) => u.id_caracteristica === Number(topCarac))?.nombre ??
          "Desconocida"

          interface ClasificacionItem {
            nombre:string,
            cantidad:number
            created_at:string
          }

          const accessors:(keyof ClasificacionItem)[] = ["nombre", "cantidad", "created_at"];
          const headers:string[] = ["Nombre", "Cantidad", "Fecha de creación"];
      
          // Usar los accessors y headers para mostrar los datos
          const displayData:ClasificacionItem[] = [
            {
              nombre: topCategoriaNombre,
              cantidad: catCount[topCategoriaId || ''] ?? 0,
              created_at: new Date().toLocaleDateString(), // Aquí puedes usar la fecha real si la tienes
            },
            {
              nombre: topUnidadNombre,
              cantidad: unitCount[topUnidadId || ''] ?? 0,
              created_at: new Date().toLocaleDateString(),
            },
            {
              nombre: topCaracNombre,
              cantidad: caractCount[topCarac || ''] ?? 0,
              created_at: new Date().toLocaleDateString(),
            },
          ];
          const rango = inicio && fin ? `Fecha: ${formatFecha(inicio)} al ${formatFecha(fin)}.` : "";
    
          return `
      ${rango}

Categoría más utilizada: ${topCategoriaNombre}  
Unidad de medida más frecuente: ${topUnidadNombre}  
Característica más común: ${topCaracNombre}  
      
Este informe presenta un resumen de las clasificaciones más frecuentes entre los elementos registrados.
      
Los datos permiten identificar patrones de uso y estandarización, así como posibles redundancias. Esta información puede ser útil para la toma de decisiones sobre nuevos registros en el sistema.
      
A continuacion daremos a conocer las unidades
      
      ${displayData
        .map(
          (item) => `
          ${headers[0]}: ${item[accessors[0]]}
          ${headers[1]}: ${item[accessors[1]]}
          ${headers[2]}: ${item[accessors[2]]}
        `
        )
        .join("\n")}`
    
    },

      filterFn: (data: Elemento[]) => data,
    },
  ];

  const selected = reports.find((r) => r.id === selectedReport);
  const handleBack = () => setSelectedReport(null);

  if (selectedReport && selected) {
    const dataPorFecha = filtrarPorFechas(elementos, fechaInicio, fechaFin);
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
        <div className="p-4 grid md:grid-cols-3 gap-4">
          {reports.map((r) => (
            <ReportCard
              key={r.id}
              title={r.title}
              description={r.description(
                r.filterFn(dataPorFecha),
                fechaInicio,
                fechaFin
              )}
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
