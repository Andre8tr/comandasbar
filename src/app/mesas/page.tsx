'use client';

import Link from 'next/link';
import { useMesaStore } from '@/lib/state';

export default function MesasDashboard() {
  const { mesas } = useMesaStore();

  return (
    <div className="min-h-screen bg-gray-50 p-4 grid grid-cols-2 sm:grid-cols-3 gap-4">
      {mesas.map((mesa) => (
        <Link
          key={mesa.id}
          href={`/mesas/${mesa.id}`}
          className="bg-white rounded-xl shadow p-6 flex flex-col items-center justify-center hover:bg-gray-100 transition"
        >
          <span className="text-lg font-bold mb-2">Mesa {mesa.id}</span>
          <span
            className={`w-4 h-4 rounded-full ${
              mesa.estado === 'pendiente'
                ? 'bg-red-500'
                : mesa.estado === 'en proceso'
                ? 'bg-yellow-400'
                : 'bg-green-500'
            }`}
          />
        </Link>
      ))}
    </div>
  );
}