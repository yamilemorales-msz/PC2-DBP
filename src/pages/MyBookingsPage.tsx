import { useEffect, useState } from 'react';
import { api, apiError, type Booking } from '../api';

export default function MyBookingsPage() {
  const [items, setItems] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [busyId, setBusyId] = useState<number | null>(null);

  async function load() {
    setLoading(true);
    setError('');
    try {
      const res = await api.get<Booking[]>('/me/loans');
      setItems(res.data);
    } catch (err) {
      setError(apiError(err).message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function finish(id: number) {
    if (!window.confirm('¿Seguro que quieres devolver este préstamo?')) return;
    setMessage('');
    setBusyId(id);
    try {
      await api.patch(`/loans/${id}/return`);
      setMessage('Préstamo devuelto.');
    } catch (err) {
      const info = apiError(err);
      setMessage(info.code === 'ALREADY_RETURNED' ? 'El préstamo ya fue devuelto.' : info.message);
    }
    setBusyId(null);
    load();
  }

  if (loading) return <p>Cargando...</p>;
  if (error) return (
    <div>
      <p className="text-red-600">{error}</p>
      <button onClick={load} className="border px-3 py-1 rounded mt-2">Reintentar</button>
    </div>
  );

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Mis préstamos</h1>
      {message && <p className="mb-3 text-blue-700">{message}</p>}
      {items.length === 0 ? (
        <p>No tienes préstamos.</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {items.map(b => (
            <li key={b.id} className="border rounded p-4">
              <p>Préstamo #{b.id}</p>
              <p>Libro: {b.bookTitle}</p>
              <p>Días: {b.days}</p>
              <p>Estado: {b.status}</p>
              {b.status === 'RETURNED' && (
                <button onClick={() => finish(b.id)} disabled={busyId === b.id}
                  className="mt-2 border border-red-600 text-red-600 px-3 py-1 rounded disabled:opacity-50">
                  Devolver
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
