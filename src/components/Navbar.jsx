const Navbar = ({ totalMovimientos }) => {
  return (
    <nav className="navbar navbar-dark bg-primary shadow-sm">
      <div className="container">
        <span className="navbar-brand d-flex align-items-center gap-2 mb-0">
          <i className="bi bi-wallet2 fs-4"></i>
          <span className="fw-bold">FinanzasPro</span>
        </span>
        <span className="badge text-bg-light">
          <i className="bi bi-activity me-1"></i>
          {totalMovimientos} movimiento{totalMovimientos !== 1 ? 's' : ''}
        </span>
      </div>
    </nav>
  );
};

export default Navbar;
