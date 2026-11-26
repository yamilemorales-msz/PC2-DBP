import { BrowserRouter, Routes, Route, Navigate, Outlet, Link, useNavigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import MaterialsPage from './pages/materialsPage';
import RoomDetailPage from './pages/RoomDetailPage.tsx';
import MyLoansPage from './pages/MyLoansPage.tsx';

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
        <Link to="/books">Libros</Link> {}
        <Link to="/my-loans">Mis préstamos</Link> {}
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
          <Route path="/books" element={<MaterialsPage />} /> {}
          <Route path="/books/:id" element={<RoomDetailPage />} /> {}
          <Route path="/my-loans" element={<MyBookingsPage />} /> {}
        </Route>
        <Route path="*" element={<Navigate to="/Authorization}" replace />} /> {}
      </Routes>
    </BrowserRouter>
  );
}
