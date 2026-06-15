import { Navigate, Route, Routes } from "react-router-dom";
import { canAccessRoute, getRoleHome, getSession } from "./data/vcmPlatform";
import LoginPage from "./pages/LoginPage";
import RegistroEntidadPage from "./pages/RegistroEntidadPage";
import FormularioActividad from "./pages/FormularioActividad";
import DashboardMantenedor from "./pages/DashboardMantenedor";
import PortalEntidadPage from "./pages/PortalEntidadPage";
import CatalogoDocentePage from "./pages/CatalogoDocentePage";
import SolicitudesEntidadPage from "./pages/SolicitudesEntidadPage";
import MisSolicitudesDocentePage from "./pages/MisSolicitudesDocentePage";

function ProtectedRoute({ path, children }) {
  const session = getSession();

  if (!session) return <Navigate to="/login" replace />;
  if (!canAccessRoute(session.role, path)) return <Navigate to={getRoleHome(session.role)} replace />;

  return children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/registro" element={<RegistroEntidadPage />} />
      <Route path="/formulario" element={<ProtectedRoute path="/formulario"><FormularioActividad /></ProtectedRoute>} />
      <Route path="/dashboard" element={<ProtectedRoute path="/dashboard"><DashboardMantenedor /></ProtectedRoute>} />
      <Route path="/portal-entidad" element={<ProtectedRoute path="/portal-entidad"><PortalEntidadPage /></ProtectedRoute>} />
      <Route path="/solicitudes-entidad" element={<ProtectedRoute path="/solicitudes-entidad"><SolicitudesEntidadPage /></ProtectedRoute>} />
      <Route path="/catalogo-docente" element={<ProtectedRoute path="/catalogo-docente"><CatalogoDocentePage /></ProtectedRoute>} />
      <Route path="/mis-solicitudes-docente" element={<ProtectedRoute path="/mis-solicitudes-docente"><MisSolicitudesDocentePage /></ProtectedRoute>} />
      <Route path="/actividades-aprobadas" element={<ProtectedRoute path="/actividades-aprobadas"><CatalogoDocentePage /></ProtectedRoute>} />
    </Routes>
  );
}
