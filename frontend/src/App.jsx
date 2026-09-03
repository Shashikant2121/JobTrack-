import { Navigate, Route, Routes } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Applications from "./pages/Applications";
import ResumeAnalyzer from "./pages/ResumeAnalyzer";

import ProtectedRoute from "./components/ProtectedRoute";
import Footer from "./components/Footer";

const App = () => {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <main className="flex-1">
        <Routes>
          {/* ==================================
              PUBLIC ROUTES
          ================================== */}

          <Route path="/login" element={<Login />} />

          <Route path="/register" element={<Register />} />

          {/* ==================================
              PROTECTED ROUTES
          ================================== */}

          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />

            <Route path="/applications" element={<Applications />} />

            <Route path="/resume" element={<ResumeAnalyzer />} />
          </Route>

          {/* ==================================
              DEFAULT ROUTE
          ================================== */}

          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          {/* ==================================
              404 ROUTE
          ================================== */}

          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </main>

      {/* FOOTER */}
      <Footer />
    </div>
  );
};

export default App;
