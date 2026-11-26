import { useEffect, useState, type FormEvent } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api, apiError, type Book } from '../api'; 

const MIN = 1;
const MAX = 7; 

export default function RoomDetailPage() {
  const { id } = useParams();
  const [book, setBook] = useState<Book | null>(null); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [value, setValue] = useState('');
  const [fieldError, setFieldError] = useState('');
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState('');

  async function load() {
    setLoading(true);
    setError('');
    try {
      const res = await api.get<Book>(`/books/${id}`); 
      setBook(res.data);
    } catch (err) {
      setError(apiError(err).message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, [id]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setMessage('');
    const n = Number(value);
    if (value.trim() === '' || !Number.isInteger(n) || n < MIN || n > MAX) {
      setFieldError(`Debe ser un número entero entre ${MIN} y ${MAX}.`);
      return;
    }
    setFieldError('');
    setSending(true);
    try {
      await api.post(`/books/${id}/loans`, { days: n }); 
      setMessage('¡Préstamo registrado!'); 
      setValue('');
      load();
    } catch (err) {
      const info = apiError(err);
      if (info.code === 'NO_COPIES') { 
        setFieldError('El libro ya no tiene copias disponibles.');  
        load();
      } else {
        setFieldError(info.message);
      }
    } finally {
      setSending(false);
    }
  }

  if (loading) return <p>Cargando...</p>;
  if (error) return (
    <div>
      <p className="text-red-600">{error}</p>
      <Link to="/books" className="text-blue-600 underline">Volver</Link> {}
    </div>
  );
  if (!book) return null;

  return (
    <div className="max-w-xl">
      <Link to="/books" className="text-blue-600 underline">← Volver al catálogo</Link> {}
      {}
      <h1 className="text-2xl font-bold mt-4">{book.title}</h1>
      <p>Autor: {book.author}</p>
      <p>Categoría: {book.category}</p>
      <p>Copias disponibles: {book.availableCopies}</p>

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-2 border rounded p-4">
        <label>
          Días de préstamo {}
          <input type="number" value={value}
            onChange={e => setValue(e.target.value)}
            className="border p-2 w-full rounded" />
        </label>
        {fieldError && <p className="text-red-600">{fieldError}</p>}
        {message && <p className="text-green-600">{message}</p>}
        <button disabled={sending} className="bg-blue-600 text-white p-2 rounded disabled:opacity-50">
          {sending ? 'Enviando...' : 'Solicitar préstamo'} {}
        </button>
      </form>
    </div>
  );
}

