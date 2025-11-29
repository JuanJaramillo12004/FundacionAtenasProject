import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";

// Layout
import AppLayout from "@/components/layout/AppLayout";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

// Rutas
import Home from "@/app/routes/Home";
import Login from "@/app/routes/Login";
import Register from "./app/routes/Register";
import AuthCallback from "@/app/routes/AuthCallback";
import CompleteProfile from "@/app/routes/CompleteProfile";
import Dashboard from "@/app/routes/Dashboard/Dashboard";

import { RawRole } from "./lib/roles";
import Profile from "@/app/routes/Profile/Profile";

function App() {
  return (
    <BrowserRouter>
      <div className="h-screen w-screen">
        <Routes>
          {/* Rutas públicas */}
          <Route path="/" element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="auth/callback" element={<AuthCallback />} />
          <Route path="complete-profile" element={<CompleteProfile />} />

          {/* Rutas protegidas - requieren autenticación */}
          <Route
            path="app/"
            element={
              <ProtectedRoute allowedRoles={[RawRole.ADMIN, RawRole.DONATOR, RawRole.DIRECTOR]}>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route
              index
              element={
                <ProtectedRoute
                  allowedRoles={[
                    RawRole.ADMIN,
                    RawRole.DIRECTOR,
                    RawRole.DONATOR,
                  ]}
                >
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="profile"
              element={
                <ProtectedRoute
                  allowedRoles={[RawRole.DIRECTOR, RawRole.DONATOR]}
                >
                  <Profile />
                </ProtectedRoute>
              }
            />

            {/* Otras rutas hijas aquí */}
            {/* <Route path="settings" element={<Settings />} /> */}
          </Route>

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
