"use client";

import { useParams, useRouter } from "next/navigation";
import { useMesaStore } from "@/lib/state";
import { useState } from "react";

export default function OrderForm() {
  const { id } = useParams();
  const router = useRouter();
  const {
    productos,
    ordenActual,
    ordenes,
    agregarProducto,
    quitarProducto,
    incrementar,
    decrementar,
    limpiarOrden,
    enviarOrden,
    completarMesa,
  } = useMesaStore();

  const orden = ordenActual[id as string] || [];
  const pedidos = ordenes[id as string] || [];

  const totalOrdenActual = orden.reduce(
    (sum, p) => sum + p.price * p.quantity,
    0
  );
  const totalPedidos = pedidos.reduce((sum, p) => sum + p.total, 0);

  const [nota, setNota] = useState("");

  const handleEnviar = async () => {
    await enviarOrden(id as string, nota);
    setNota("");
  };

  const handleCompletar = () => {
    completarMesa(id as string);
    router.push("/mesas");
  };

  const handleVolver = () => {
    router.push("/mesas");
  };

  const handlePrint = async () => {
    const html2pdf = (await import("html2pdf.js")).default;

    const element = document.getElementById("print-section");
    if (element) {
      html2pdf()
        .from(element)
        .set({
          margin: 5,
          filename: `mesa-${id}-cuenta.pdf`,
          html2canvas: { scale: 2 },
          jsPDF: { unit: "mm", format: "a7", orientation: "portrait" },
        })
        .save();
    }
  };

  return (
    <div className="min-h-screen p-4 bg-gray-50 sm:flex sm:space-x-6">
      {/* Productos */}
      <div className="flex-1 space-y-6">
        <h1 className="text-xl font-bold mb-4">Mesa {id}</h1>

        {productos.map((cat) => (
          <div key={cat.name}>
            <h2 className="text-lg font-semibold mb-2">{cat.name}</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4">
              {cat.items.map((item) => (
                <button
                  key={item.name}
                  onClick={() => agregarProducto(id as string, item)}
                  className="bg-blue-200 text-blue-800 hover:bg-blue-300 px-2 py-2 rounded-xl transition-colors"
                >
                  {item.name} - Q{item.price}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Orden actual y pedidos anteriores */}
      <div className="w-full sm:max-w-sm space-y-6 mt-6 sm:mt-2">
        {/* Orden actual */}
        {orden.length > 0 && (
          <div className="bg-white p-4 rounded-xl shadow space-y-4 mt-4">
            <h3 className="text-md font-bold">Orden actual:</h3>
            <ul className="divide-y divide-gray-200">
              {orden.map((p, i) => (
                <li key={i} className="flex justify-between items-center py-2">
                  <span className="w-1/2">
                    {p.name} - {p.quantity} - Q{p.price * p.quantity}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => decrementar(id as string, p)}
                      className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                    >
                      -
                    </button>
                    <span>{p.quantity}</span>
                    <button
                      onClick={() => incrementar(id as string, p)}
                      className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                    >
                      +
                    </button>
                    <button
                      onClick={() => quitarProducto(id as string, p)}
                      className="ml-2 text-red-600 hover:underline text-sm"
                    >
                      ✕
                    </button>
                  </div>
                </li>
              ))}
            </ul>
            <div className="text-right font-bold">
              Total actual: Q{totalOrdenActual}
            </div>
            <div>
              <label className="text-sm text-gray-700 font-medium">
                Observaciones:
              </label>
              <textarea
                value={nota}
                onChange={(e) => setNota(e.target.value)}
                className="w-full mt-1 border border-gray-300 rounded p-2"
                placeholder="Sin hielo, con limón, etc."
              />
            </div>
          </div>
        )}

        {/* Pedidos anteriores */}
        {pedidos.length > 0 && (
          <div className="bg-white p-4 rounded-xl shadow space-y-4">
            <h3 className="text-md font-bold">Pedidos anteriores:</h3>
            {/* Contenido visible */}
            {pedidos.map((pedido, idx) => (
              <div
                key={idx}
                className="space-y-1 text-sm text-gray-700 border-b pb-2"
              >
                <h4 className="font-semibold">Pedido {idx + 1}:</h4>
                <ul>
                  {pedido.items.map((item, i) => (
                    <li key={i}>
                      {item.name} x {item.quantity} - Q
                      {item.price * item.quantity}
                    </li>
                  ))}
                </ul>
                {pedido.nota && (
                  <p className="italic text-red-500">Nota: {pedido.nota}</p>
                )}
                <div className="text-right font-semibold">
                  Total: Q{pedido.total}
                </div>
              </div>
            ))}
            <div className="text-right font-bold text-base pt-2">
              Total global pedidos: Q{totalPedidos}
            </div>

            {/* Contenido oculto para imprimir */}
            <div id="print-section" className="hidden">
              <div>
                <h2>Cuenta - Mesa {id}</h2>
                {pedidos.map((pedido, idx) => (
                  <div key={idx}>
                    <h3>Pedido {idx + 1}</h3>
                    <ul>
                      {pedido.items.map((item, i) => (
                        <li key={i}>
                          {item.name} x {item.quantity} = Q
                          {item.price * item.quantity}
                        </li>
                      ))}
                    </ul>
                    {pedido.nota && <p>Nota: {pedido.nota}</p>}
                    <p>Total: Q{pedido.total}</p>
                    <hr />
                  </div>
                ))}
                <h3>Total global: Q{totalPedidos}</h3>
              </div>
            </div>
          </div>
        )}

        {/* Botones */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between mt-6 py-6">
          <button
            onClick={handleEnviar}
            disabled={orden.length === 0}
            className={`px-4 py-2 rounded-xl font-semibold ${
              orden.length === 0
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-green-500 text-white hover:bg-green-600"
            }`}
          >
            Enviar Orden
          </button>

          <button
            onClick={() => limpiarOrden(id as string)}
            className="px-4 py-2 bg-red-200 text-red-700 hover:bg-red-300 rounded-xl font-semibold"
          >
            Limpiar Orden
          </button>

          <button
            onClick={handleCompletar}
            className="px-4 py-2 bg-blue-100 text-blue-600 hover:bg-blue-200 rounded-xl font-semibold"
          >
            Orden Completada
          </button>
        </div>

        {/* Botón imprimir */}
        {pedidos.length > 0 && (
          <button
            onClick={handlePrint}
            className="w-full sm:w-auto px-4 py-2 bg-black text-white rounded-xl hover:bg-gray-800 font-semibold"
          >
            🖨️ Imprimir Cuenta
          </button>
        )}

        <div className="pt-6">
          <button
            onClick={handleVolver}
            className="px-4 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-xl font-medium w-full sm:w-auto"
          >
            ← Volver al menú de mesas
          </button>
        </div>
      </div>
    </div>
  );
}
