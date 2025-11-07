import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";

// Layout
import AppLayout from "@/components/layout/AppLayout";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

// Rutas
import Home from "@/app/routes/Home";
import Login from "@/app/routes/Login";
import Register from "./app/routes/Register";
import Dashboard from "@/app/routes/Dashboard/Dashboard";

import { RawRole } from "./lib/roles";

function App() {
  return (
    <BrowserRouter>
      <div className="h-screen w-screen">
        <Routes>
          {/* Rutas públicas */}
          <Route path="/" element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />

          {/* Rutas protegidas - requieren autenticación */}
          <Route 
            path="app" 
            element={
              <ProtectedRoute allowedRoles={[RawRole.ADMIN, RawRole.DONATOR]}>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            {/* Dashboard como ruta index (sin path o con index) */}
            <Route index element={<Dashboard />} />
            
            {/* Otras rutas hijas aquí */}
            {/* <Route path="profile" element={<Profile />} /> */}
            {/* <Route path="settings" element={<Settings />} /> */}
          </Route>

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
