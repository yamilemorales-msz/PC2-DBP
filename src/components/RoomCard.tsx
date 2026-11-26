import type { Book } from '../api'; 

export default function RoomCard({ book }: { book: Book }) { 
  return (
    <Link to={`/books/${book.id}`} className="block border rounded p-4 hover:bg-gray-50"> {/* CAMBIÓ: ruta del detalle */}
      {}
      <h2 className="text-lg font-bold">{book.title}</h2>
      <p>Autor: {book.author}</p>
      <p>Categoría: {book.category}</p>
      <p>Copias disponibles: {book.availableCopies}</p>
    </Link>
  );
}
