"use client";

import { useState } from "react";
import { products } from "@/utils/products";

export default function OrderForm() {
  const [order, setOrder] = useState<string[]>([]);
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>({});
  const [clickedItems, setClickedItems] = useState<Set<string>>(new Set());

  const handleAddItem = (item: string) => {
    setOrder((prev) => [...prev, item]);

    // Efecto visual corto (300ms)
    setClickedItems((prev) => {
      const newSet = new Set(prev).add(item);
      setTimeout(() => {
        setClickedItems((current) => {
          const copy = new Set(current);
          copy.delete(item);
          return copy;
        });
      }, 300);
      return newSet;
    });
  };

  const handleRemoveItem = (index: number) => {
    const itemToRemove = order[index];
    setOrder((prev) => prev.filter((_, i) => i !== index));
  };

  const toggleCategory = (category: string) => {
    setOpenCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-2xl p-8 mt-8 border border-gray-200">
      <h1 className="text-3xl font-extrabold mb-6 text-center text-blue-700">
        🧾 Toma de Comanda
      </h1>

      {/* Categorías */}
      {Object.keys(products).map((category) => (
        <div key={category} className="mb-6 border-b pb-4">
          <button
            onClick={() => toggleCategory(category)}
            className="w-full text-left text-xl font-semibold text-blue-600 hover:underline focus:outline-none"
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
            <span className="float-right">{openCategories[category] ? "▲" : "▼"}</span>
          </button>

          {openCategories[category] && (
            <div className="mt-4 flex flex-wrap gap-3">
              {category === "cervezas"
                ? products[category].map((product) =>
                    product.types.map((type) => {
                      const label = `${product.name} (${type})`;
                      const isClicked = clickedItems.has(label);

                      return (
                        <button
                          key={label}
                          onClick={() => handleAddItem(label)}
                          className={`py-2 px-4 rounded-xl text-sm font-medium border transition-all duration-300
                            ${
                              isClicked
                                ? "bg-green-300 border-green-500"
                                : "bg-blue-100 text-blue-900 hover:bg-blue-200 border-blue-300"
                            }
                          `}
                        >
                          {label}
                        </button>
                      );
                    })
                  )
                : products[category].map((item: string, index: number) => {
                    const key = `${category}-${index}`;
                    const isClicked = clickedItems.has(item);

                    return (
                      <button
                        key={key}
                        onClick={() => handleAddItem(item)}
                        className={`py-2 px-4 rounded-xl text-sm font-medium border transition-all duration-300
                          ${
                            isClicked
                              ? "bg-green-300 border-green-500"
                              : "bg-blue-100 text-blue-900 hover:bg-blue-200 border-blue-300"
                          }
                        `}
                      >
                        {item}
                      </button>
                    );
                  })}
            </div>
          )}
        </div>
      ))}

      {/* Orden actual */}
      <div className="mt-10">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">🧺 Orden actual</h2>

        {order.length === 0 ? (
          <p className="text-gray-500 italic">No hay productos seleccionados.</p>
        ) : (
          <ul className="space-y-2">
            {order.map((item, index) => (
              <li
                key={index}
                className="flex justify-between items-center bg-gray-100 p-3 rounded-lg border border-gray-200 shadow-sm"
              >
                <span className="font-medium text-gray-700">{item}</span>
                <button
                  onClick={() => handleRemoveItem(index)}
                  className="text-red-600 hover:text-red-800 text-sm font-semibold"
                >
                  Eliminar
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}