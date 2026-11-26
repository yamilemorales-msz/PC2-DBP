import { useEffect, useState } from 'react';
import { api, apiError, type Book, type Page } from '../api'; 
import RoomCard from '../components/RoomCard';
import Pagination from '../components/Pagination';

export default function DashboardPage() {
  const [page, setPage] = useState(1);
  const [data, setData] = useState<Page<Book> | null>(null); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function load() {
    setLoading(true);
    setError('');
    try {
    
      const res = await api.get<Page<Book>>('/books', { params: { page, size: 4 } });
      setData(res.data);
    } catch (err) {
      setError(apiError(err).message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, [page]);

  if (loading) return <p>Cargando...</p>;
  if (error) return (
    <div>
      <p className="text-red-600">{error}</p>
      <button onClick={load} className="border px-3 py-1 rounded mt-2">Reintentar</button>
    </div>
  );
  if (!data || data.items.length === 0) return <p>No hay libros.</p>; 

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Libros</h1> {}
      <div className="flex flex-col gap-3">
        {data.items.map(book => <RoomCard key={book.id} book={book} />)} {}
      </div>
      <Pagination page={page} totalPages={data.totalPages} onChange={setPage} />
    </div>
  );
}


