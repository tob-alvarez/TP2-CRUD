import ResumenFinanciero from './ResumenFinanciero';

const formatMonto = (monto) =>
  new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(monto);

const formatFecha = (fecha) => (fecha ? fecha.split('-').reverse().join('/') : '');

const Dashboard = ({ movimientos = [] }) => {
  const movimientosArray = Array.isArray(movimientos) ? movimientos : [];

  const ingresos = movimientosArray.filter((m) => m.tipo === 'ingreso').reduce((acc, m) => acc + m.monto, 0);
  const gastos = movimientosArray.filter((m) => m.tipo === 'gasto').reduce((acc, m) => acc + m.monto, 0);
  const balance = ingresos - gastos;

  // Top categorías de gasto
  const categoriaGastos = movimientosArray
    .filter((m) => m.tipo === 'gasto')
    .reduce((acc, m) => {
      acc[m.categoria] = (acc[m.categoria] || 0) + m.monto;
      return acc;
    }, {});

  const topCategorias = Object.entries(categoriaGastos)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  const ultimos = [...movimientosArray]
    .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
    .slice(0, 5);

  return (
    <div>
      <ResumenFinanciero
        ingresos={ingresos}
        gastos={gastos}
        balance={balance}
        totalMovimientos={movimientosArray.length}
      />

      <div className="row g-3">
        {/* Top categorías de gasto */}
        <div className="col-12 col-lg-5">
          <div className="card h-100">
            <div className="card-header bg-white fw-semibold">
              <i className="bi bi-pie-chart me-2"></i>Top categorías de gasto
            </div>
            <div className="card-body">
              {topCategorias.length === 0 ? (
                <p className="text-muted text-center my-4 mb-0">Sin datos de gastos.</p>
              ) : (
                topCategorias.map(([cat, monto]) => {
                  const pct = gastos > 0 ? ((monto / gastos) * 100).toFixed(0) : 0;
                  return (
                    <div key={cat} className="mb-3">
                      <div className="d-flex justify-content-between small mb-1">
                        <span>{cat}</span>
                        <span className="text-muted">{formatMonto(monto)} ({pct}%)</span>
                      </div>
                      <div className="progress" role="progressbar" aria-valuenow={pct} aria-valuemin="0" aria-valuemax="100" style={{ height: 8 }}>
                        <div className="progress-bar bg-danger" style={{ width: `${pct}%` }}></div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Últimos movimientos */}
        <div className="col-12 col-lg-7">
          <div className="card h-100">
            <div className="card-header bg-white fw-semibold">
              <i className="bi bi-clock-history me-2"></i>Últimos movimientos
            </div>
            <ul className="list-group list-group-flush">
              {ultimos.length === 0 ? (
                <li className="list-group-item text-muted text-center">Sin movimientos.</li>
              ) : (
                ultimos.map((m) => (
                  <li key={m.id} className="list-group-item d-flex justify-content-between align-items-center">
                    <div>
                      <div className="fw-semibold">{m.descripcion}</div>
                      <small className="text-muted">
                        {m.categoria} · {formatFecha(m.fecha)}
                      </small>
                    </div>
                    <span className={`fw-semibold ${m.tipo === 'ingreso' ? 'text-success' : 'text-danger'}`}>
                      {m.tipo === 'ingreso' ? '+' : '-'}{formatMonto(m.monto)}
                    </span>
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
