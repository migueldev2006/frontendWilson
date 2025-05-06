import { axiosAPI } from "../axiosAPI";

export async function deleteArea(id_area: number): Promise<any> {
  await axiosAPI.put(`areas/estado/${id_area}`);
  return id_area;
}
