import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api, apiError } from '../api';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!name.trim()) { setError('El nombre no puede estar vacío.'); return; }
    setError('');
    setSending(true);
    try {
      await api.post('/auth/register', { name, email, password });
      navigate('/login');
    } catch (err) {
      setError(apiError(err).message);
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="max-w-sm mx-auto mt-16 p-6 border rounded">
      <h1 className="text-2xl font-bold mb-4">Crear cuenta</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <label>
          Nombre
          <input required maxLength={100} value={name}
            onChange={e => setName(e.target.value)}
            className="border p-2 w-full rounded" />
        </label>
        <label>
          Email
          <input type="email" required value={email}
            onChange={e => setEmail(e.target.value)}
            className="border p-2 w-full rounded" />
        </label>
        <label>
          Contraseña (8 a 72 caracteres)
          <input type="password" required minLength={8} maxLength={72} value={password}
            onChange={e => setPassword(e.target.value)}
            className="border p-2 w-full rounded" />
        </label>
        {error && <p className="text-red-600">{error}</p>}
        <button disabled={sending} className="bg-blue-600 text-white p-2 rounded disabled:opacity-50">
          {sending ? 'Registrando...' : 'Registrarme'}
        </button>
      </form>
      <p className="mt-4">¿Ya tienes cuenta? <Link to="/login" className="text-blue-600 underline">Inicia sesión</Link></p>
    </div>
  );
}
