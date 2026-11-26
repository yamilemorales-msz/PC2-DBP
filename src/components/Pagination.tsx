interface Props {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}

export default function Pagination({ page, totalPages, onChange }: Props) {
  return (
    <div className="flex items-center gap-4 mt-4">
      <button disabled={page <= 1} onClick={() => onChange(page - 1)}
        className="border px-3 py-1 rounded disabled:opacity-50">Anterior</button>
      <span>Página {page} de {totalPages}</span>
      <button disabled={page >= totalPages} onClick={() => onChange(page + 1)}
        className="border px-3 py-1 rounded disabled:opacity-50">Siguiente</button>
    </div>
  );
}
