import { Chart, registerables } from "chart.js";
import GraficaBase from "@/components/graficasBase/graficas";
import { useInventariosStock } from "@/hooks/Inventarios/useStock";
import { useSitios } from "@/hooks/sitios/useSitios";
import { useAreas } from "@/hooks/areas/useAreas";

Chart.register(...registerables);

const StockEstadisticas = () => {
  // 1) Datos de inventario, sitios y áreas
  const { stock: inventarios = [], isLoading: loadStock, isError: errStock, error } = useInventariosStock();
  const { sitios = [], isLoading: loadSitios, isError: errSitios } = useSitios();
  const { areas = [], isLoading: loadAreas, isError: errAreas } = useAreas();

  if (loadStock || loadSitios || loadAreas) return <p>Cargando datos…</p>;
  if (errStock || errSitios || errAreas) return <p>Error cargando datos: {`${error}`}</p>;
  if (!inventarios.length) return <p>No hay datos de inventario.</p>;

  // 2) Map de sitios (por nombre) y áreas
  const sitioMap = sitios.reduce((acc, s) => ({ ...acc, [s.nombre]: s }), {} as Record<string, typeof sitios[0]>);
  const areaMap = areas.reduce((acc, a) => ({ ...acc, [a.id_area]: a.nombre }), {} as Record<number, string>);

  // 3) Enriquecer inventarios con nombre de sitio y área
  const invConArea = inventarios.map(i => {
    const sitio = sitioMap[i.sitio];
    const areaNombre = sitio ? areaMap[sitio.fk_area] : "Sin área";
    return {
      ...i,
      sitioNombre: sitio?.nombre || "Desconocido",
      areaNombre,
    };
  });

  // 4) Agrupar por área
  const porArea: Record<string, typeof invConArea> = {};
  invConArea.forEach(item => {
    const area = item.areaNombre;
    if (!porArea[area]) porArea[area] = [];
    porArea[area].push(item);
  });

  // 5) Generar gráficas por área
  const graficas = Object.entries(porArea).map(([area, items], idx) => {
    const sitiosUnicos = Array.from(new Set(items.map(i => i.sitioNombre)));
    const elementosUnicos = Array.from(new Set(items.map(i => i.elemento)));

    // stock por sitio y elemento
    const grouped: Record<string, number[]> = {};
    elementosUnicos.forEach(el => {
      grouped[el] = sitiosUnicos.map(sitio => {
        const fila = items.find(x => x.sitioNombre === sitio && x.elemento === el);
        return fila?.stock || 0;
      });
    });

    const data = {
      labels: sitiosUnicos,
      datasets: elementosUnicos.map((el, iEl) => ({
        label: el,
        data: grouped[el],
        backgroundColor: `hsl(${(idx * 60 + iEl * 30) % 360}, 70%, 60%)`,
      })),
    };

    return (
      
      <GraficaBase
        key={area}
        className="bg-white dark:bg-zinc-800 dark:text-white"
        tipo="bar"
        data={data}
        options={{
          responsive: true,
          scales: { y: { beginAtZero: true, ticks: { precision: 0, stepSize: 1 } } },
        }}
        titulo={`Área: ${area}`}
      />
    );
  });

  return (
    <div className="p-3">
      <h2 className="text-xl font-semibold mb-4 text-zinc-800 dark:text-white">
        Stock por Área
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {graficas}
      </div>
    </div>
  );
};

export default StockEstadisticas;
