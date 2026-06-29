const formatMonto = (monto) =>
  new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(monto);

const formatFecha = (fecha) => {
  if (!fecha) return 'Sin fecha';
  const [year, month, day] = fecha.split('-');
  return `${day}/${month}/${year}`;
};

const MovimientoItem = ({ movimiento, onEditar, onEliminar }) => {
  const { id, descripcion, monto, tipo, categoria, fecha } = movimiento;
  const esIngreso = tipo === 'ingreso';

  return (
    <tr>
      <td className="text-muted small">{formatFecha(fecha)}</td>
      <td><span className="badge text-bg-light border">{categoria}</span></td>
      <td>
        <span className={`badge me-2 ${esIngreso ? 'text-bg-success' : 'text-bg-danger'}`}>
          <i className={`bi bi-arrow-${esIngreso ? 'down' : 'up'}-circle`}></i>
        </span>
        {descripcion}
      </td>
      <td className={`text-end fw-semibold ${esIngreso ? 'text-success' : 'text-danger'}`}>
        {esIngreso ? '+' : '-'}{formatMonto(monto)}
      </td>
      <td className="text-end">
        <div className="btn-group btn-group-sm">
          <button
            id={`edit-btn-${id}`}
            className="btn btn-outline-warning"
            onClick={() => onEditar(movimiento)}
            title="Editar">
            <i className="bi bi-pencil"></i>
          </button>
          <button
            id={`delete-btn-${id}`}
            className="btn btn-outline-danger"
            onClick={() => onEliminar(id)}
            title="Eliminar">
            <i className="bi bi-trash"></i>
          </button>
        </div>
      </td>
    </tr>
  );
};

export default MovimientoItem;
