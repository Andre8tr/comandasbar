"use client";

import { create } from "zustand";

type EstadoMesa = "rojo" | "amarillo" | "verde";

interface Producto {
  name: string;
  price: number;
}

interface Categoria {
  name: string;
  items: Producto[];
}

interface OrdenItem {
  name: string;
  price: number;
  quantity: number;
}

interface Pedido {
  items: OrdenItem[];
  total: number;
}

interface Mesa {
  id: string;
  estado: EstadoMesa;
}

interface MesaState {
  mesas: Mesa[];
  setEstadoMesa: (id: string, estado: EstadoMesa) => void;
  productos: Categoria[];
  ordenActual: Record<string, OrdenItem[]>;
  ordenes: Record<string, Pedido[]>;
  agregarProducto: (id: string, producto: Producto) => void;
  quitarProducto: (id: string, producto: Producto) => void;
  incrementar: (id: string, producto: Producto) => void;
  decrementar: (id: string, producto: Producto) => void;
  enviarOrden: (id: string) => void;
  limpiarOrden: (id: string) => void;
  completarMesa: (id: string) => void;
}

export const useMesaStore = create<MesaState>((set, get) => ({
  mesas: Array.from({ length: 9 }, (_, i) => ({
    id: `${i + 1}`,
    estado: "verde",
  })),

  setEstadoMesa: (id, estado) =>
    set((state) => ({
      mesas: state.mesas.map((m) => (m.id === id ? { ...m, estado } : m)),
    })),

  productos: [
    {
      name: "Cervezas 🍺",
      items: [
        { name: "Gallo Botella", price: 15 },
        { name: "Cabro Reserva Botella", price: 20 },
        { name: "Corona Botella", price: 15 },
        { name: "Gallo Litro", price: 30 },
        { name: "Cabro Litro", price: 30 },
      ],
    },
    {
      name: "Tragos Preparados 🍹",
      items: [
        { name: "Cuba Libre", price: 25 },
        { name: "Jagger Fresh", price: 30 },
        { name: "Jagger Bomb", price: 35 },
        { name: "Whisky", price: 20 },
        { name: "Ron", price: 20 },
        { name: "Bloody Mary", price: 30 },
        { name: "Charro Negro", price: 25 },
      ],
    },
    {
      name: "Bebidas 🥤",
      items: [
        { name: "Cimarrona", price: 25 },
        { name: "Jugo V8 preparado", price: 25 },
        { name: "Agua Pura", price: 5 },
        { name: "Coca-Cola", price: 10 },
        { name: "Sprite", price: 10 },
      ],
    },
    {
      name: "Comida 🍔",
      items: [
        { name: "Nachos Preparados", price: 30 },
        { name: "Papas Fritas", price: 25 },
        { name: "Tostadas", price: 20 },
        { name: "Pizza Dog", price: 25 },
      ],
    },
  ],

  ordenActual: {},
  ordenes: {},

  agregarProducto: (id, producto) => {
    const actual = get().ordenActual[id] || [];
    const existente = actual.find((p) => p.name === producto.name);
    const actualizado = existente
      ? actual.map((p) =>
          p.name === producto.name ? { ...p, quantity: p.quantity + 1 } : p
        )
      : [...actual, { ...producto, quantity: 1 }];

    set((state) => ({
      ordenActual: { ...state.ordenActual, [id]: actualizado },
      mesas: state.mesas.map((m) =>
        m.id === id ? { ...m, estado: "rojo" } : m
      ),
    }));
  },

  quitarProducto: (id, producto) => {
    const actual = get().ordenActual[id] || [];
    const actualizado = actual.filter((p) => p.name !== producto.name);
    set((state) => ({
      ordenActual: { ...state.ordenActual, [id]: actualizado },
    }));
  },

  incrementar: (id, producto) => {
    const actual = get().ordenActual[id] || [];
    const actualizado = actual.map((p) =>
      p.name === producto.name ? { ...p, quantity: p.quantity + 1 } : p
    );
    set((state) => ({
      ordenActual: { ...state.ordenActual, [id]: actualizado },
    }));
  },

  decrementar: (id, producto) => {
    const actual = get().ordenActual[id] || [];
    const actualizado = actual
      .map((p) =>
        p.name === producto.name ? { ...p, quantity: p.quantity - 1 } : p
      )
      .filter((p) => p.quantity > 0);
    set((state) => ({
      ordenActual: { ...state.ordenActual, [id]: actualizado },
    }));
  },

  enviarOrden: (id) => {
    const actual = get().ordenActual[id] || [];
    const total = actual.reduce((sum, p) => sum + p.price * p.quantity, 0);
    const nuevoPedido = { items: actual, total };
    const previos = get().ordenes[id] || [];
    set((state) => ({
      ordenes: { ...state.ordenes, [id]: [...previos, nuevoPedido] },
      ordenActual: { ...state.ordenActual, [id]: [] },
      mesas: state.mesas.map((m) =>
        m.id === id ? { ...m, estado: "amarillo" } : m
      ),
    }));
  },

  limpiarOrden: (id) =>
    set((state) => ({ ordenActual: { ...state.ordenActual, [id]: [] } })),

  completarMesa: (id) =>
    set((state) => ({
      mesas: state.mesas.map((m) =>
        m.id === id ? { ...m, estado: "verde" } : m
      ),
      ordenActual: { ...state.ordenActual, [id]: [] },
      ordenes: { ...state.ordenes, [id]: [] },
    })),
}));
