import Tap from "@/components/molecules/Tabs";
import UsersTable from './usuarios';
import TipoSitioTable from './tipoSitio'
import CentrosTable from './centros'
import ModulosTable from './modulo'
import RutasTable from "./rutas";
import MunicipiosTable from "./municipio";
import CategoriasTable from "./categorias";
const Admin =() => {

        const tabs = [
            {
                key : "1",
                title : "Usuarios",
                content : <UsersTable/>
            },
            {
                key : "2",
                title : "Centros",
                content : <CentrosTable/>
            },
            {
                key : "3",
                title : "Tipos de Sitios",
                content : <TipoSitioTable/>
            },
            {
                key : "4",
                title : "Modulos",
                content : <ModulosTable/>
            },
            {
                key : "5",
                title : "Rutas",
                content : <RutasTable/>
            },
            {
                key : "6",
                title : "Municipios",
                content : <MunicipiosTable/>
            },
            {
                key : "7",
                title : "Categorias",
                content : <CategoriasTable/>
            },
            
        ]

  return (
        
        <Tap tabs={tabs}></Tap>
  )
}

export default Admin