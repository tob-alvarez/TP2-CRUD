const formatMonto = (monto) =>
  new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(monto);

const ResumenFinanciero = ({ ingresos, gastos, balance, totalMovimientos }) => {
  return (
    <div className="row g-3 mb-4">
      {/* Ingresos */}
      <div className="col-12 col-sm-6 col-xl-3">
        <div className="card text-bg-success h-100">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h6 className="card-subtitle mb-2 text-white-50">Ingresos</h6>
                <h4 className="card-title mb-0">{formatMonto(ingresos)}</h4>
              </div>
              <i className="bi bi-arrow-down-circle fs-1 opacity-75"></i>
            </div>
          </div>
        </div>
      </div>

      {/* Gastos */}
      <div className="col-12 col-sm-6 col-xl-3">
        <div className="card text-bg-danger h-100">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h6 className="card-subtitle mb-2 text-white-50">Gastos</h6>
                <h4 className="card-title mb-0">{formatMonto(gastos)}</h4>
              </div>
              <i className="bi bi-arrow-up-circle fs-1 opacity-75"></i>
            </div>
          </div>
        </div>
      </div>

      {/* Balance */}
      <div className="col-12 col-sm-6 col-xl-3">
        <div className={`card h-100 ${balance >= 0 ? 'text-bg-primary' : 'text-bg-warning'}`}>
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h6 className="card-subtitle mb-2 text-white-50">Balance</h6>
                <h4 className="card-title mb-0">{formatMonto(balance)}</h4>
              </div>
              <i className={`bi bi-${balance >= 0 ? 'graph-up-arrow' : 'graph-down-arrow'} fs-1 opacity-75`}></i>
            </div>
          </div>
        </div>
      </div>

      {/* Registros */}
      <div className="col-12 col-sm-6 col-xl-3">
        <div className="card text-bg-secondary h-100">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h6 className="card-subtitle mb-2 text-white-50">Registros</h6>
                <h4 className="card-title mb-0">{totalMovimientos}</h4>
              </div>
              <i className="bi bi-receipt fs-1 opacity-75"></i>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumenFinanciero;
