import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api, apiError } from '../api';

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setSending(true);
    try {
      const { data } = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', data.token);
      navigate('/Authorization');
    } catch (err) {
      setError(apiError(err).message);
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="max-w-sm mx-auto mt-16 p-6 border rounded">
      <h1 className="text-2xl font-bold mb-4">Iniciar sesión</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <label>
          Email
          <input type="email" required value={email}
            onChange={e => setEmail(e.target.value)}
            className="border p-2 w-full rounded" />
        </label>
        <label>
          Contraseña
          <input type="password" required value={password}
            onChange={e => setPassword(e.target.value)}
            className="border p-2 w-full rounded" />
        </label>
        {error && <p className="text-red-600">{error}</p>}
        <button disabled={sending} className="bg-blue-600 text-white p-2 rounded disabled:opacity-50">
          {sending ? 'Ingresando...' : 'Ingresar'}
        </button>
      </form>
      <p className="mt-4">¿No tienes cuenta? <Link to="/register" className="text-blue-600 underline">Regístrate</Link></p>
    </div>
  );
}
