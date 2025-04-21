import { Link, useParams } from "react-router-dom";
import { InventariosTable } from "@/pages/Bodega/Inventario/Tablas/Inventarios";
import { useSitios } from "@/hooks/sitios/useSitios";
import { Button } from "@heroui/button";

export const InventarioSitio = () => {
  const { sitioId } = useParams();
  const idSitio = sitioId ? parseInt(sitioId) : 0;

  const { sitios, isLoading, isError } = useSitios();

  if (isLoading) return <p>Cargando sitio...</p>;
  if (isError) return <p>Error al cargar el sitio.</p>;

  const sitio = sitios?.find((s) => s.id_sitio === idSitio);

  if (!sitio) return <p>Sitio no encontrado</p>;
  return (
    <div>
      <Link to={`/bodega/inventario/areas/${idSitio}`}>
        <h2 className="text-lg m-4 font-semibold">
          <Button className=" bg-blue-600 text-white hover:bg-blue-800 hover:text-white dark:hover:text-white">
            Regresar
          </Button>
        </h2>
      </Link>
      <h1 className="text-2xl font-bold text-center mb-4">
        Inventario del sitio {sitio.nombre}
      </h1>
      <InventariosTable idSitio={idSitio} />
    </div>
  );
};
