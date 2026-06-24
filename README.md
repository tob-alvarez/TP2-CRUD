# FinanzasPro — App de Finanzas Personales (React + Vite)

Aplicación React para gestionar finanzas personales (ingresos y gastos).
CRUD completo vía **AJAX** (axios) contra **json-server** (API REST mock sobre `db.json`),
con estilos de **Bootstrap 5**. No requiere escribir un backend propio.

## Requisitos cumplidos
- **React** (Vite + React 19, componentes funcionales).
- **CRUD con AJAX**: `src/services/movimientoService.js` (GET/POST/PUT/DELETE con axios).
- **Framework CSS**: Bootstrap 5 + bootstrap-icons.
- **Comunicación padre-hijo**: `App` pasa datos y callbacks por props a `Dashboard`,
  `MovimientoForm`, `MovimientoList` → `MovimientoItem` (los hijos avisan al padre con callbacks).
- **Hooks**: `useState`, `useEffect`, `useCallback`.

## Requisitos
- Node.js 18+

## Puesta en marcha

Se necesitan **dos terminales**:

### 1) API (json-server, puerto 3001)
```bash
npm install
npm run api      # json-server --watch db.json --port 3001
```
Expone `GET/POST/PUT/DELETE http://localhost:3001/movimientos`.

### 2) Frontend (Vite, puerto 5173)
```bash
npm run dev
```
Abrir http://localhost:5173

## Scripts
- `npm run dev` — servidor de desarrollo (Vite)
- `npm run api` — API REST mock (json-server sobre `db.json`)
- `npm run build` — build de producción
- `npm run lint` — ESLint
- `npm run preview` — previsualizar el build

## Estructura
```
src/
  App.jsx                       # estado global + handlers CRUD
  services/movimientoService.js # capa AJAX (axios)
  components/
    Navbar.jsx
    Dashboard.jsx               # resumen + gráficos simples
    ResumenFinanciero.jsx       # tarjetas de totales
    MovimientoForm.jsx          # alta/edición con validaciones
    MovimientoList.jsx          # búsqueda, filtros y orden
    MovimientoItem.jsx          # fila de la tabla
```
