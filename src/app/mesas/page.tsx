"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useMesaStore } from "@/lib/state";

export default function MesasDashboard() {
  const { mesas, syncMesasWithFirestore } = useMesaStore();

  useEffect(() => {
    syncMesasWithFirestore();
  }, []);

  const getColorClass = (estado: string) => {
    switch (estado) {
      case "rojo":
        return "bg-red-400";
      case "amarillo":
        return "bg-yellow-300";
      case "verde":
        return "bg-green-400";
      case "despachado":
        return "bg-blue-400"; // 👈 Aquí mapea correctamente "despachado"
      default:
        return "bg-gray-300";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 grid grid-cols-3 gap-4">
      {mesas.map((mesa) => (
        <Link
          key={mesa.id}
          href={`/mesas/${mesa.id}`}
          className={`rounded-xl ${getColorClass(
            mesa.estado
          )} text-white font-semibold shadow-md transition hover:scale-105 h-32 flex flex-col items-center justify-center`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6 text-white mb-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 10h18M4 10v10m16-10v10M8 10v10m8-10v10M3 6h18"
            />
          </svg>
          <span className="text-sm">Mesa {mesa.id}</span>
        </Link>
      ))}
    </div>
  );
}
