import { Navigate, Route, Routes } from "react-router-dom";
import FormularioActividad from "./pages/FormularioActividad";
import DashboardActividades from "./pages/DashboardActividades";
import HubActividadesAprobadas from "./pages/HubActividadesAprobadas";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/formulario" replace />} />
      <Route path="/formulario" element={<FormularioActividad />} />
      <Route path="/dashboard" element={<DashboardActividades />} />
      <Route
        path="/actividades-aprobadas"
        element={<HubActividadesAprobadas />}
      />
    </Routes>
  );
}