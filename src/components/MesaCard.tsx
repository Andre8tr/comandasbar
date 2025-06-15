// src/components/MesaCard.tsx
import Link from 'next/link';

const statusColors = {
  idle: 'bg-red-400',
  in_progress: 'bg-yellow-400',
  done: 'bg-green-400',
};

export default function MesaCard({ mesa }: { mesa: { id: number, status: string } }) {
  return (
    <Link href={`/mesas/${mesa.id}`}>
      <div className={`rounded-xl p-6 text-white text-center text-xl font-bold ${statusColors[mesa.status]}`}>
        Mesa {mesa.id}
      </div>
    </Link>
  );
}