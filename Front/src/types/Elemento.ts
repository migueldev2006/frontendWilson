import { ElementoPostData } from "@/axios/Elementos/postElemento";

export interface Elemento extends ElementoPostData {
  id_elemento?: number;
  created_at?: string | undefined;
  updated_at?: string | undefined;
  tipoElemento: "perecedero" | "no_perecedero";
}
