import { useState } from "react";
import { useMunicipio } from "@/hooks/Municipio/useMunicipio";
import { VisualizadorPDF } from "@/components/organismos/PDFVisualizer";
import { ReportTemplate } from "@/components/templates/Report";
import { ReportCard } from "@/components/molecules/ReportCard";
import { Municipio } from "@/schemas/Municipios";

export default function MunicipioReport() {
    const { municipios } = useMunicipio();

    const [fechaInicio, setFechaInicio] = useState<string>("");
    const [fechaFin, setFechaFin] = useState<string>("");
    const [selectedReport, setSelectedReport] = useState<string | null>(null);

    if (!municipios) return <p>Cargando...</p>;

    const filtrarPorFechas = (data: Municipio[], inicio: string, fin: string) => {
        if (!inicio || !fin) return [];
        const from = new Date(`${inicio}T00:00:00`);
        const to = new Date(`${fin}T23:59:59`);
        return data.filter((municipio) => {
            const fecha = new Date(municipio.created_at);
            return fecha >= from && fecha <= to;
        });
    };

    const formatFecha = (fecha: string) => {
        const d = new Date(fecha);
        d.setHours(d.getHours() + 5);
        return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
    };

    const dataFiltrada = filtrarPorFechas(municipios, fechaInicio, fechaFin);

    const reports = [
        {
            id: "todos",
            title: "Total de Municipios Registrados",
            description: (data: Municipio[], inicio?: string, fin?: string) => {
                const total = data.length;
                const activos = data.filter((e) => e.estado).length;
                const rango = inicio && fin ? `Fecha: ${formatFecha(inicio)} al ${formatFecha(fin)}.` : "";

                return `
${rango}

En este reporte se presenta el total de municipios registrados en el sistema durante el periodo indicado. De un total de ${total} municipios, ${activos} están activos.

El seguimiento de municipios permite visualizar la cobertura territorial y el estado administrativo actual.

A continuación se listan los registros encontrados:`.trim();
            },
            headers: ["Nombre", "Fecha de creación"],
            accessors: ["nombre", "created_at"],
            withTable: true,
            filterFn: (data: Municipio[]) => filtrarPorFechas(data, fechaInicio, fechaFin),
        },
        {
            id: "activos",
            title: "Municipios Activos",
            description: (data: Municipio[], inicio?: string, fin?: string) => {
                const activos = data.filter((e) => e.estado).length;
                const rango = inicio && fin ? `Fecha: ${formatFecha(inicio)} al ${formatFecha(fin)}.` : "";

                return `
${rango}

Se han encontrado ${activos} municipios activos en el sistema.

El estado activo indica que el municipio está actualmente habilitado y disponible para su gestión.`.trim();
            },
            headers: ["Nombre", "Fecha de creación"],
            accessors: ["nombre", "created_at"],
            withTable: true,
            filterFn: (data: Municipio[]) => data.filter((e) => e.estado),
        },
        {
            id: "inactivos",
            title: "Municipios Inactivos",
            description: (data: Municipio[], inicio?: string, fin?: string) => {
                const inactivos = data.filter((e) => !e.estado).length;
                const rango = inicio && fin ? `Fecha: ${formatFecha(inicio)} al ${formatFecha(fin)}.` : "";

                return `
${rango}

Actualmente hay ${inactivos} municipios inactivos.

Este estado puede deberse a actualizaciones administrativas, reestructuración territorial o suspensión temporal de uso.`.trim();
            },
            headers: ["Nombre", "Fecha de creación"],
            accessors: ["nombre", "created_at"],
            withTable: true,
            filterFn: (data: Municipio[]) => data.filter((e) => !e.estado),
        },
        {
            id: "nuevos",
            title: "Municipios Registrados en el Mes",
            description: (data: Municipio[], inicio?: string, fin?: string) => {
                if (!inicio || !fin) return "No se proporcionó un rango de fechas.";
                console.log(data);
                return `
Entre el ${formatFecha(inicio)} y el ${formatFecha(fin)}, se han registrado los siguientes municipios`.trim();
            },
            headers: ["Nombre", "Fecha de creación"],
            accessors: ["nombre", "created_at"],
            withTable: true,
            filterFn: (data: Municipio[]) => data,
        },
    ];

    const selected = reports.find((r) => r.id === selectedReport);
    const handleBack = () => setSelectedReport(null);

    if (selectedReport && selected) {
        const dataPorFecha = filtrarPorFechas(municipios, fechaInicio, fechaFin);
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
                            <label className="block text-sm text-center font-medium">Fecha de inicio</label>
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
                <div className="ml-12 mr-12 gap-4 grid xl:grid-cols-3">
                    {reports.map((r) => (
                        <ReportCard
                            key={r.id}
                            title={r.title}
                            description={r.description(r.filterFn(dataFiltrada), fechaInicio, fechaFin)}
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
