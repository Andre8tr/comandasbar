"use client";

import Link from "next/link";
import { useMesaStore } from "@/lib/state";

const estadoClases = {
  rojo: "bg-red-300 text-red-900",
  amarillo: "bg-yellow-200 text-yellow-800",
  verde: "bg-green-300 text-green-900",
};

export default function MesasDashboard() {
  const { mesas } = useMesaStore();

  return (
    <div className="min-h-150 bg-gray-50 p-2 grid grid-cols-2 sm:grid-cols-3 gap-2 items-center justify-items-center">
      {mesas.map((mesa) => (
        <Link
          key={mesa.id}
          href={`/mesas/${mesa.id}`}
          className={`w-32 h-32 sm:w-32 sm:h-32 rounded-xl shadow flex flex-col items-center justify-center text-sm font-bold hover:scale-105 transition-all duration-200 ${
            estadoClases[mesa.estado]
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-12 h-12 mb-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 6l1 10m15-10l-1 10M9 6v10m6-10v10"
            />
          </svg>
          Mesa {mesa.id}
        </Link>
      ))}
    </div>
  );
}
