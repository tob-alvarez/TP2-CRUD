import db from '../../db.json';

const KEY = 'movimientos';

function getMovimientos() {
  const data = localStorage.getItem(KEY);
  if (data) {
    return JSON.parse(data);
  }
  localStorage.setItem(KEY, JSON.stringify(db.movimientos));
  return db.movimientos;
}

function guardar(movimientos) {
  localStorage.setItem(KEY, JSON.stringify(movimientos));
}

const movimientoService = {
  getAll: () => {
    return getMovimientos();
  },

  create: (movimiento) => {
    const movimientos = getMovimientos();
    const nuevo = { ...movimiento, id: Date.now().toString() };
    movimientos.push(nuevo);
    guardar(movimientos);
    return nuevo;
  },

  update: (id, movimiento) => {
    const movimientos = getMovimientos();
    const actualizados = movimientos.map((m) =>
      m.id === id ? { ...movimiento, id } : m
    );
    guardar(actualizados);
    return { ...movimiento, id };
  },

  delete: (id) => {
    const movimientos = getMovimientos();
    guardar(movimientos.filter((m) => m.id !== id));
  },
};

export default movimientoService;
