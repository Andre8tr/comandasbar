'use client'

import React, { useState } from 'react'

// Inventario actualizado
const products = [
  {
    name: 'Cerveza 🍺',
    items: [
      { name: 'Gallo', types: ['Botella', 'Lata'], price: 15 },
      { name: 'Cabro', types: ['Botella', 'Lata'], price: 20 },
      { name: 'Corona', types: ['Botella', 'Lata'], price: 15 },
      { name: 'Gallo', types: ['Litro'], price: 30 },
      { name: 'Cabro', types: ['Litro'], price: 30 },
    ],
  },
  {
    name: 'Bebidas Preparadas 🍹',
    items: [
      { name: 'Cuba Libre', price: 25 },
      { name: 'Jagger Fresh', price: 30 },
      { name: 'Jagger Bomb', price: 35 },
      { name: 'Whisky', price: 25 },
      { name: 'Ron', price: 20 },
      { name: 'Bloody Mary', price: 30 },
      { name: 'Charro Negro', price: 25 },
      { name: 'Quetzalteca', price: 20 },
      { name: 'Preparada', price: 25 },
    ],
  },
  {
    name: 'Shots 🥃',
    items: [
      { name: 'Shot de Tequila', price: 10 },
      { name: 'Shot de Tequila 2 OZ', price: 20 },
      { name: 'Shot de Jagger 1 OZ', price: 15 },
      { name: 'Shot de Jagger 2 OZ', price: 25 },
    ],
  },
  {
    name: 'Refrescos 🥤',
    items: [
      { name: 'Coca-Cola', price: 10 },
      { name: 'Agua Pura', price: 8 },
      { name: 'Sprite', price: 10 },
      { name: '7-Up', price: 10 },
    ],
  },
  {
    name: 'Comida 🍔',
    items: [
      { name: 'Nachos Preparados', price: 30 },
      { name: 'Papas Fritas', price: 25 },
      { name: 'Tostadas', price: 20 },
      { name: 'Panini Jamon', price: 35 },
      { name: 'Panini Quesos', price: 30 },
    ],
  },
]

type OrderItem = {
  name: string
  type?: string
  price: number
}

export default function OrderForm() {
  const [order, setOrder] = useState<OrderItem[]>([])

  const handleAddItem = (item: OrderItem) => {
    setOrder((prev) => [...prev, item])
  }

  const handleRemoveItem = (index: number) => {
    setOrder((prev) => prev.filter((_, i) => i !== index))
  }

  const handleClearOrder = () => {
    setOrder([])
  }

  const total = order.reduce((sum, item) => sum + item.price, 0)

  return (
    <div className="space-y-6">
      {products.map((category) => (
        <div key={category.name} className="bg-white shadow rounded-xl p-4">
          <h2 className="text-xl font-semibold mb-3 text-blue-700">{category.name}</h2>
          <div className="flex flex-wrap gap-3">
            {category.items.map((item, idx) => {
              if (item.types) {
                return item.types.map((type) => (
                  <button
                    key={`${item.name}-${type}-${idx}`}
                    onClick={() => handleAddItem({ name: `${item.name} (${type})`, price: item.price })}
                    className="relative bg-blue-100 hover:bg-blue-200 text-blue-900 font-medium py-2 px-4 rounded-xl transition transform active:scale-95"
                  >
                    {item.name} ({type}) - Q{item.price}
                  </button>
                ))
              }
              return (
                <button
                  key={`${item.name}-${idx}`}
                  onClick={() => handleAddItem({ name: item.name, price: item.price })}
                  className="relative bg-green-100 hover:bg-green-200 text-green-900 font-medium py-2 px-4 rounded-xl transition transform active:scale-95"
                >
                  {item.name} - Q{item.price}
                </button>
              )
            })}
          </div>
        </div>
      ))}

      {/* Resumen de la orden */}
      <div className="bg-white p-4 shadow rounded-xl">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-bold">Resumen de orden</h2>
          <button
            onClick={handleClearOrder}
            className="text-sm text-red-600 hover:underline"
          >
            Limpiar orden
          </button>
        </div>
        {order.length === 0 ? (
          <p className="text-gray-500">No hay productos seleccionados.</p>
        ) : (
          <ul className="space-y-4">
            {order.map((item, idx) => (
              <li
                key={idx}
                className="flex justify-between items-center border-b border-gray-300/50 pb-2"
              >
                <div>
                  <span className="block text-sm font-medium">{item.name}</span>
                  <span className="text-xs text-gray-500">Q{item.price}</span>
                </div>
                <button
                  onClick={() => handleRemoveItem(idx)}
                  className="text-xs text-red-500 hover:underline"
                >
                  Eliminar
                </button>
              </li>
            ))}
          </ul>
        )}
        <div className="mt-6 text-right font-bold text-lg">
          Total: Q{total}
        </div>
      </div>
    </div>
  )
}