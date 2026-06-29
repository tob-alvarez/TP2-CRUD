import { useState } from 'react';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import MovimientoForm from './components/MovimientoForm';
import MovimientoList from './components/MovimientoList';
import movimientoService from './services/movimientoService';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './App.css';

function App() {
  const [movimientos, setMovimientos] = useState(movimientoService.getAll());
  const [movimientoEditado, setMovimientoEditado] = useState(null);
  const [vista, setVista] = useState('dashboard');
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleCrear = (nuevoMovimiento) => {
    const creado = movimientoService.create(nuevoMovimiento);
    setMovimientos([...movimientos, creado]);
    showToast('Movimiento creado exitosamente.');
  };

  const handleActualizar = (movimientoActualizado) => {
    const actualizado = movimientoService.update(movimientoEditado.id, movimientoActualizado);
    setMovimientos(movimientos.map((m) => (m.id === actualizado.id ? actualizado : m)));
    setMovimientoEditado(null);
    showToast('Movimiento actualizado exitosamente.');
  };

  const handleEliminar = (id) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este movimiento?')) return;
    movimientoService.delete(id);
    setMovimientos(movimientos.filter((m) => m.id !== id));
    showToast('Movimiento eliminado.');
  };

  const handleEditar = (movimiento) => {
    setMovimientoEditado(movimiento);
    setVista('movimientos');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setMovimientoEditado(null);
  };

  const handleSubmitForm = (data) => {
    if (movimientoEditado) {
      handleActualizar(data);
    } else {
      handleCrear(data);
    }
  };

  return (
    <div className="min-vh-100 bg-light">
      <Navbar totalMovimientos={movimientos.length} />

      <div className="container py-4">
        <ul className="nav nav-tabs mb-4">
          <li className="nav-item">
            <button
              id="tab-dashboard"
              className={`nav-link ${vista === 'dashboard' ? 'active' : ''}`}
              onClick={() => setVista('dashboard')}>
              <i className="bi bi-grid-fill me-2"></i>Dashboard
            </button>
          </li>
          <li className="nav-item">
            <button
              id="tab-movimientos"
              className={`nav-link ${vista === 'movimientos' ? 'active' : ''}`}
              onClick={() => setVista('movimientos')}>
              <i className="bi bi-list-ul me-2"></i>Movimientos
            </button>
          </li>
        </ul>

        {vista === 'dashboard' && <Dashboard movimientos={movimientos} />}

        {vista === 'movimientos' && (
          <div className="row g-4">
            <div className="col-12 col-lg-4">
              <MovimientoForm
                onSubmit={handleSubmitForm}
                movimientoEditado={movimientoEditado}
                onCancelEdit={handleCancelEdit}
              />
            </div>
            <div className="col-12 col-lg-8">
              <MovimientoList
                movimientos={movimientos}
                onEditar={handleEditar}
                onEliminar={handleEliminar}
              />
            </div>
          </div>
        )}
      </div>

      {toast && (
        <div className="position-fixed bottom-0 end-0 p-3" style={{ zIndex: 1080 }}>
          <div className={`alert ${toast.type === 'success' ? 'alert-success' : 'alert-danger'} shadow-sm mb-0 d-flex align-items-center gap-2`}>
            <i className={`bi bi-${toast.type === 'success' ? 'check-circle-fill' : 'exclamation-triangle-fill'}`}></i>
            <span>{toast.message}</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
