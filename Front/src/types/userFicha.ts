    export type UserFicha = {
        id_usuario_ficha: number;
        created_at:string,
        updated_at:string,
        fk_usuario: number;
        fk_ficha: number;
    }