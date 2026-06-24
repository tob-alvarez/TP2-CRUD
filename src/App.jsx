import { useState, useEffect, useCallback } from 'react';
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
  const [movimientos, setMovimientos] = useState([]);
  const [movimientoEditado, setMovimientoEditado] = useState(null);
  const [loading, setLoading] = useState(true);
  const [vista, setVista] = useState('dashboard'); // 'dashboard' | 'movimientos'
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  const cargarMovimientos = useCallback(async () => {
    try {
      const data = await movimientoService.getAll();
      setMovimientos(Array.isArray(data) ? data : []);
    } catch {
      showToast('Error al cargar los movimientos. ¿Está corriendo el backend?', 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    cargarMovimientos();
  }, [cargarMovimientos]);

  const handleCrear = async (nuevoMovimiento) => {
    try {
      const creado = await movimientoService.create(nuevoMovimiento);
      setMovimientos((prev) => [...prev, creado]);
      showToast('Movimiento creado exitosamente.');
    } catch {
      showToast('Error al crear el movimiento.', 'error');
    }
  };

  const handleActualizar = async (movimientoActualizado) => {
    try {
      const actualizado = await movimientoService.update(movimientoEditado.id, movimientoActualizado);
      setMovimientos((prev) => prev.map((m) => (m.id === actualizado.id ? actualizado : m)));
      setMovimientoEditado(null);
      showToast('Movimiento actualizado exitosamente.');
    } catch {
      showToast('Error al actualizar el movimiento.', 'error');
    }
  };

  const handleEliminar = async (id) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este movimiento?')) return;
    try {
      await movimientoService.delete(id);
      setMovimientos((prev) => prev.filter((m) => m.id !== id));
      showToast('Movimiento eliminado.');
    } catch {
      showToast('Error al eliminar el movimiento.', 'error');
    }
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
      return handleActualizar(data);
    }
    return handleCrear(data);
  };

  return (
    <div className="min-vh-100 bg-light">
      <Navbar totalMovimientos={movimientos.length} />

      <div className="container py-4">
        {/* Tabs */}
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
                key={movimientoEditado?.id ?? 'nuevo'}
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
                loading={loading}
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
