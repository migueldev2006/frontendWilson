import Tap from "@/components/molecules/Tabs";
import UsersTable from './usuarios';
import AreaTable from './areas';
import FcihasTable from './fichas';
import ProgramasTable from './programas';
import RolModuloTable from './rolModulo';
import SedeTable from './sedes';
import SitiosTable from './sitios';
import PermisoTable from './permisos';
import Home from '../Home/Home';

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
                content : <></>
            },
            {
                key : "3",
                title : "Areas",
                content : <AreaTable/>
            },
            {
                key : "4",
                title : "#",
                content : <Home/>
            },
            {
                key : "5",
                title : "Fichas",
                content : <FcihasTable/>
            },
            {
                key : "6",
                title : "Programas de formación",
                content : <ProgramasTable/>
            },
            {
                key : "7",
                title : "permisos",
                content : <Home/>
            },
            {
                key : "8",
                title : "Rol Modulo",
                content : <RolModuloTable/>
            },
            {
                key : "9",
                title : "sedes",
                content : <SedeTable/>
            },
            {
                key : "10",
                title : "sitios",
                content : <SitiosTable/>
            },
            {
                key : "11",
                title : "permisos",
                content : <PermisoTable/>
            }
        ]

  return (
        
        <Tap tabs={tabs}></Tap>
  )
}

export default Admin