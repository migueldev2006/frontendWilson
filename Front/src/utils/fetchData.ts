import axios from "axios"

export const fetchEntidad = async (entidad: string) => {
  const res = await axios.get(`http://localhost:3000/${entidad}`)
  return res.data
}
