
export type User = {
    imagen_url: string | null;
    id_usuario: number;
    documento: number;
    nombre: string;
    apellido: string;
    edad: number;
    telefono: string;
    correo: string;
    estado: boolean;
    cargo: string;
    password: string;
    fk_rol: number;
}

export type LoginCrede = {
    documento : number,
    password : string
}

export type LoginRes = {
    token : string,
    documento : number,
    password : string
}

export interface ReporteUsuario {
    id_usuario: number;
    nombre_completo: string;
    documento: string;
    correo: string;
    rol: string;
    centro: string | null;
    estado: boolean;
    created_at: string; 
    updated_at: string; 
    total_fichas: number;
    elementos_asignados: string[]; 
  }
  
  export interface ReporteAsignacionElemento {
    created_at: string;
    id_usuario: number;
    nombre_usuario: string;
    documento: string;
    rol: string;
    nombre_elemento: string | null;
    fecha_asignacion: string | null;
  }
  
  export interface ReporteUsuariosPorFicha {
    id_ficha: number;
    codigo: string;
    nombre: string;
    total_usuarios: number;
    created_at: string; 
  }
  
  export interface ReporteMovimientosUsuarioElemento {
    id_usuario: number;
    nombre_usuario: string;
    documento: string;
    rol: string;
    id_elemento: number;
    nombre_elemento: string;
    total_movimientos: number;
    created_at: string; 
  }
  