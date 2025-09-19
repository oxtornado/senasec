import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Equipment from "./pages/Equipment";
import Inventory from "./pages/Inventory";
import Loans from "./pages/Loans";
import Reports from "./pages/Reports";
import Users from "./pages/Users";
import Assignments from "./pages/Assignments";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import { UserProvider } from "./contexts/UsersContext";
import { AmbienteProvider } from "./contexts/EnvironmentContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import { EquipmentProvider } from "./contexts/EquipmentContext";
import { AssignmentsProvider } from "./contexts/AssignmentsContext";
import { ReportsProvider } from "./contexts/ReportsContext";
import  LoginAula  from "./pages/LoginAula";

function App() {
  return (
    <LanguageProvider>
      <UserProvider>
        <AmbienteProvider>
          <EquipmentProvider>
            <AssignmentsProvider>
              <ReportsProvider>
              <Router>
            <Routes>
              {/* Rutas públicas */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/loginaula" element={<LoginAula />} />

              {/* Rutas protegidas con Layout */}
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }>
                <Route index element={<Navigate to="/dashboard/equipment" replace />} />
                <Route path="equipment" element={<Equipment />} />
                <Route path="inventory" element={<Inventory />} />
                <Route path="loans" element={<Loans />} />
                <Route path="reports" element={<Reports />} />
                <Route path="assignments" element={<Assignments />} />
                <Route path="users" element={<Users />} />
              </Route>
              
              {/* Ruta catch-all */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
              </Router>
              </ReportsProvider>
            </AssignmentsProvider>
          </EquipmentProvider>
        </AmbienteProvider>
      </UserProvider>
    </LanguageProvider>
  );
}

export default App;
