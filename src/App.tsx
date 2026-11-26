import { BrowserRouter, Routes, Route, Navigate, Outlet, Link, useNavigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import RoomDetailPage from './pages/RoomDetailPage.tsx';
import MyBookingsPage from './pages/MyBookingsPage';

function ProtectedLayout() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  if (!token) return <Navigate to="/login" replace />;

  function logout() {
    localStorage.removeItem('token');
    navigate('/login');
  }

  return (
    <div>
      <header className="flex gap-4 p-4 bg-gray-100">
        <Link to="/books">Libros</Link> {/* CAMBIÓ */}
        <Link to="/my-loans">Mis préstamos</Link> {/* CAMBIÓ */}
        <button onClick={logout} className="ml-auto text-red-600">Cerrar sesión</button>
      </header>
      <main className="p-4">
        <Outlet />
      </main>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route element={<ProtectedLayout />}>
          <Route path="/books" element={<DashboardPage />} /> {/* CAMBIÓ */}
          <Route path="/books/:id" element={<RoomDetailPage />} /> {/* CAMBIÓ */}
          <Route path="/my-loans" element={<MyBookingsPage />} /> {/* CAMBIÓ */}
        </Route>
        <Route path="*" element={<Navigate to="/books" replace />} /> {/* CAMBIÓ */}
      </Routes>
    </BrowserRouter>
  );
}
