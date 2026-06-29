import { useState } from 'react';
import MovimientoItem from './MovimientoItem';

const MovimientoList = ({ movimientos = [], onEditar, onEliminar }) => {
  const [filtro, setFiltro] = useState('todos');
  const [busqueda, setBusqueda] = useState('');
  const [ordenDesc, setOrdenDesc] = useState(true);

  const movimientosFiltrados = movimientos
    .filter((m) => {
      const matchFiltro = filtro === 'todos' || m.tipo === filtro;
      const texto = busqueda.toLowerCase();
      const matchBusqueda =
        m.descripcion.toLowerCase().includes(texto) ||
        m.categoria.toLowerCase().includes(texto);
      return matchFiltro && matchBusqueda;
    })
    .sort((a, b) => {
      const diff = new Date(a.fecha) - new Date(b.fecha);
      return ordenDesc ? -diff : diff;
    });

  return (
    <div className="card shadow-sm">
      <div className="card-header bg-white d-flex justify-content-between align-items-center flex-wrap gap-2">
        <span className="fw-semibold">
          <i className="bi bi-list-check me-2"></i>
          Movimientos
          <span className="text-muted fw-normal ms-2 small">
            ({movimientosFiltrados.length} de {movimientos.length})
          </span>
        </span>
        <button
          id="toggle-order-btn"
          className="btn btn-sm btn-outline-secondary"
          onClick={() => setOrdenDesc(!ordenDesc)}>
          <i className={`bi bi-sort-${ordenDesc ? 'down' : 'up'} me-1`}></i>
          {ordenDesc ? 'Más reciente' : 'Más antiguo'}
        </button>
      </div>

      <div className="card-body">
        {/* Búsqueda */}
        <div className="input-group mb-3">
          <span className="input-group-text"><i className="bi bi-search"></i></span>
          <input
            type="text"
            className="form-control"
            id="busqueda-input"
            placeholder="Buscar por descripción o categoría..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
          {busqueda && (
            <button className="btn btn-outline-secondary" type="button" onClick={() => setBusqueda('')}>
              <i className="bi bi-x-lg"></i>
            </button>
          )}
        </div>

        {/* Filtros */}
        <div className="btn-group btn-group-sm mb-3" role="group">
          {[
            { key: 'todos', label: 'Todos' },
            { key: 'ingreso', label: 'Ingresos' },
            { key: 'gasto', label: 'Gastos' },
          ].map(({ key, label }) => (
            <button
              key={key}
              id={`filter-${key}-btn`}
              className={`btn ${filtro === key ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => setFiltro(key)}>
              {label}
            </button>
          ))}
        </div>

        {/* Tabla */}
        {movimientosFiltrados.length === 0 ? (
          <p className="text-muted text-center py-4 mb-0">
            {busqueda || filtro !== 'todos'
              ? 'No se encontraron movimientos con ese filtro.'
              : 'No hay movimientos registrados aún.'}
          </p>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Categoría</th>
                  <th>Descripción</th>
                  <th className="text-end">Monto</th>
                  <th className="text-end">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {movimientosFiltrados.map((movimiento) => (
                  <MovimientoItem
                    key={movimiento.id}
                    movimiento={movimiento}
                    onEditar={onEditar}
                    onEliminar={onEliminar}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default MovimientoList;
