import axios from 'axios';

// Capa de datos vía AJAX contra json-server (API REST sobre db.json, puerto 3001).
// Levantar con: npm run api
const BASE_URL = 'http://localhost:3001/movimientos';

const movimientoService = {
  // GET (lista) -> json-server devuelve el array directamente
  getAll: async () => {
    const response = await axios.get(BASE_URL);
    return response.data;
  },

  // GET (por id) -> objeto
  getById: async (id) => {
    const response = await axios.get(`${BASE_URL}/${id}`);
    return response.data;
  },

  // POST -> objeto creado (con id generado por json-server)
  create: async (movimiento) => {
    const response = await axios.post(BASE_URL, movimiento);
    return response.data;
  },

  // PUT -> objeto actualizado
  update: async (id, movimiento) => {
    const response = await axios.put(`${BASE_URL}/${id}`, movimiento);
    return response.data;
  },

  // DELETE -> json-server responde {}
  delete: async (id) => {
    const response = await axios.delete(`${BASE_URL}/${id}`);
    return response.data;
  },
};

export default movimientoService;
