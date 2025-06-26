"use client";

import { useRouter } from "next/navigation";

const tableStatusColors = {
  pending: "bg-red-400",
  inProgress: "bg-yellow-300",
  completed: "bg-green-400",
};

const tables = Array.from({ length: 9 }, (_, i) => ({
  id: i + 1,
  status: "pending",
}));

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-100 p-6 grid grid-cols-2 sm:grid-cols-3 gap-4">
      {tables.map((table) => (
        <div
          key={table.id}
          onClick={() => router.push(`/mesas/${table.id}`)}
          className={`cursor-pointer rounded-xl shadow-lg flex items-center justify-center h-32 text-white text-2xl font-bold transition duration-200 hover:scale-105 ${
            tableStatusColors[table.status as keyof typeof tableStatusColors]
          }`}
        >
          {table.id}
        </div>
      ))}
    </div>
  );
}
