import { useState } from 'react';

const CATEGORIAS_INGRESO = ['Trabajo', 'Freelance', 'Inversiones', 'Alquiler', 'Ventas', 'Otros'];
const CATEGORIAS_GASTO = ['Alimentación', 'Vivienda', 'Transporte', 'Salud', 'Entretenimiento', 'Educación', 'Ropa', 'Servicios', 'Otros'];

const HOY = new Date().toISOString().split('T')[0];

const getInitialState = () => ({
  descripcion: '',
  monto: '',
  tipo: 'ingreso',
  categoria: '',
  fecha: HOY,
});

// Deriva el estado del formulario desde el movimiento a editar (o estado inicial).
// El componente se remonta vía `key` en App, por eso alcanza con inicializar el estado.
const buildState = (mov) =>
  mov
    ? {
        descripcion: mov.descripcion,
        monto: mov.monto,
        tipo: mov.tipo,
        categoria: mov.categoria,
        fecha: mov.fecha,
      }
    : getInitialState();

const MovimientoForm = ({ onSubmit, movimientoEditado, onCancelEdit }) => {
  const [formData, setFormData] = useState(() => buildState(movimientoEditado));
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const categorias = formData.tipo === 'ingreso' ? CATEGORIAS_INGRESO : CATEGORIAS_GASTO;

  const validate = () => {
    const newErrors = {};
    const desc = formData.descripcion.trim();

    if (!desc) {
      newErrors.descripcion = 'La descripción es obligatoria.';
    } else if (desc.length < 3) {
      newErrors.descripcion = 'La descripción debe tener al menos 3 caracteres.';
    } else if (desc.length > 60) {
      newErrors.descripcion = 'La descripción no puede superar los 60 caracteres.';
    }

    if (formData.monto === '' || formData.monto === null) {
      newErrors.monto = 'El monto es obligatorio.';
    } else if (isNaN(formData.monto) || Number(formData.monto) <= 0) {
      newErrors.monto = 'Ingrese un monto válido mayor a 0.';
    }

    if (!['ingreso', 'gasto'].includes(formData.tipo)) {
      newErrors.tipo = 'Seleccione un tipo válido.';
    }

    if (!formData.categoria) {
      newErrors.categoria = 'Seleccione una categoría.';
    }

    if (!formData.fecha) {
      newErrors.fecha = 'La fecha es obligatoria.';
    } else if (formData.fecha > HOY) {
      newErrors.fecha = 'La fecha no puede ser futura.';
    }

    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      // Al cambiar el tipo, reseteamos la categoría porque cambia la lista
      ...(name === 'tipo' ? { categoria: '' } : {}),
    }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setLoading(true);
    try {
      await onSubmit({
        descripcion: formData.descripcion.trim(),
        monto: Number(formData.monto),
        tipo: formData.tipo,
        categoria: formData.categoria,
        fecha: formData.fecha,
      });
      setFormData(getInitialState());
      setErrors({});
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData(getInitialState());
    setErrors({});
    onCancelEdit();
  };

  const isEditing = !!movimientoEditado;

  return (
    <div className="card shadow-sm">
      <div className="card-header bg-white fw-semibold">
        <i className={`bi bi-${isEditing ? 'pencil-square' : 'plus-circle'} me-2`}></i>
        {isEditing ? 'Editar movimiento' : 'Nuevo movimiento'}
      </div>
      <div className="card-body">
        <form onSubmit={handleSubmit} id="movimiento-form" noValidate>
          {/* Tipo */}
          <div className="mb-3">
            <label className="form-label">Tipo</label>
            <div className="btn-group w-100" role="group">
              <input
                type="radio"
                className="btn-check"
                name="tipo"
                id="tipo-ingreso"
                value="ingreso"
                checked={formData.tipo === 'ingreso'}
                onChange={handleChange}
              />
              <label className="btn btn-outline-success" htmlFor="tipo-ingreso">
                <i className="bi bi-arrow-down-circle me-1"></i>Ingreso
              </label>

              <input
                type="radio"
                className="btn-check"
                name="tipo"
                id="tipo-gasto"
                value="gasto"
                checked={formData.tipo === 'gasto'}
                onChange={handleChange}
              />
              <label className="btn btn-outline-danger" htmlFor="tipo-gasto">
                <i className="bi bi-arrow-up-circle me-1"></i>Gasto
              </label>
            </div>
          </div>

          {/* Descripción */}
          <div className="mb-3">
            <label htmlFor="descripcion" className="form-label">Descripción</label>
            <input
              type="text"
              className={`form-control ${errors.descripcion ? 'is-invalid' : ''}`}
              id="descripcion"
              name="descripcion"
              placeholder="Ej: Salario mensual"
              maxLength={60}
              value={formData.descripcion}
              onChange={handleChange}
            />
            {errors.descripcion && <div className="invalid-feedback">{errors.descripcion}</div>}
          </div>

          {/* Monto */}
          <div className="mb-3">
            <label htmlFor="monto" className="form-label">Monto</label>
            <div className="input-group has-validation">
              <span className="input-group-text">$</span>
              <input
                type="number"
                className={`form-control ${errors.monto ? 'is-invalid' : ''}`}
                id="monto"
                name="monto"
                placeholder="0"
                min="0.01"
                step="0.01"
                value={formData.monto}
                onChange={handleChange}
              />
              {errors.monto && <div className="invalid-feedback">{errors.monto}</div>}
            </div>
          </div>

          {/* Categoría */}
          <div className="mb-3">
            <label htmlFor="categoria" className="form-label">Categoría</label>
            <select
              className={`form-select ${errors.categoria ? 'is-invalid' : ''}`}
              id="categoria"
              name="categoria"
              value={formData.categoria}
              onChange={handleChange}>
              <option value="">Seleccionar categoría</option>
              {categorias.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            {errors.categoria && <div className="invalid-feedback">{errors.categoria}</div>}
          </div>

          {/* Fecha */}
          <div className="mb-3">
            <label htmlFor="fecha" className="form-label">Fecha</label>
            <input
              type="date"
              className={`form-control ${errors.fecha ? 'is-invalid' : ''}`}
              id="fecha"
              name="fecha"
              max={HOY}
              value={formData.fecha}
              onChange={handleChange}
            />
            {errors.fecha && <div className="invalid-feedback">{errors.fecha}</div>}
          </div>

          {/* Botones */}
          <div className="d-flex gap-2">
            <button
              type="submit"
              id="submit-movimiento-btn"
              className={`btn flex-fill ${isEditing ? 'btn-warning' : 'btn-primary'}`}
              disabled={loading}>
              {loading ? (
                <><span className="spinner-border spinner-border-sm me-2"></span>Guardando...</>
              ) : (
                <><i className={`bi bi-${isEditing ? 'check-circle' : 'plus-circle'} me-2`}></i>{isEditing ? 'Actualizar' : 'Agregar'}</>
              )}
            </button>
            {isEditing && (
              <button type="button" id="cancel-edit-btn" className="btn btn-outline-secondary" onClick={handleCancel}>
                Cancelar
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default MovimientoForm;
