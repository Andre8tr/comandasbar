"use client";

import { create } from "zustand";
import { db } from "./firebase";
import {
  doc,
  setDoc,
  onSnapshot,
  updateDoc,
  deleteField,
} from "firebase/firestore";

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
  nota?: string;
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
  enviarOrden: (id: string, nota?: string) => Promise<void>;
  limpiarOrden: (id: string) => void;
  completarMesa: (id: string) => void;
  syncMesasWithFirestore: () => void;
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
        { name: "Mineral", price: 10 },
      ],
    },
    {
      name: "Comida 🍔",
      items: [
        { name: "Nachos Preparados", price: 30 },
        { name: "Papas Fritas", price: 15 },
        { name: "Papas Especiales", price: 15 },
        { name: "Tostadas", price: 20 },
        { name: "Pizza Dog", price: 25 },
        { name: "Alitas 6/u", price: 35 },
        { name: "Alitas 10/u", price: 50 },
      ],
    },
    {
      name: "Extras 🚬",
      items: [
        { name: "Cigarros 3u", price: 10 },
        { name: "Vaso quebrado", price: 25 },
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

  enviarOrden: async (id, nota) => {
    const actual = get().ordenActual[id] || [];
    const total = actual.reduce((sum, p) => sum + p.price * p.quantity, 0);
    const nuevoPedido = { items: actual, total, nota };
    const previos = get().ordenes[id] || [];

    const nuevosPedidos = [...previos, nuevoPedido];
    const nuevaOrden = { ...get().ordenActual, [id]: [] };

    set((state) => ({
      ordenes: { ...state.ordenes, [id]: nuevosPedidos },
      ordenActual: nuevaOrden,
      mesas: state.mesas.map((m) =>
        m.id === id ? { ...m, estado: "amarillo" } : m
      ),
    }));

    const docRef = doc(db, "mesas", id);
    await setDoc(docRef, {
      pedidos: nuevosPedidos,
      ordenActual: [],
    });
  },

  limpiarOrden: (id) =>
    set((state) => ({
      ordenActual: { ...state.ordenActual, [id]: [] },
    })),

  completarMesa: (id) => {
    set((state) => ({
      ordenActual: { ...state.ordenActual, [id]: [] },
      ordenes: { ...state.ordenes, [id]: [] },
      mesas: state.mesas.map((m) =>
        m.id === id ? { ...m, estado: "verde" } : m
      ),
    }));

    const docRef = doc(db, "mesas", id);
    updateDoc(docRef, {
      pedidos: deleteField(),
      ordenActual: deleteField(),
    });
  },

  syncMesasWithFirestore: () => {
    for (let i = 1; i <= 9; i++) {
      const id = `${i}`;
      const docRef = doc(db, "mesas", id);
      onSnapshot(docRef, (docSnap) => {
        const data = docSnap.data();
        if (data) {
          const ordenActual = data.ordenActual || [];
          const pedidos = data.pedidos || [];

          const estado: EstadoMesa =
            ordenActual.length > 0
              ? "rojo"
              : pedidos.length > 0
              ? "amarillo"
              : "verde";

          set((state) => ({
            ordenActual: { ...state.ordenActual, [id]: ordenActual },
            ordenes: { ...state.ordenes, [id]: pedidos },
            mesas: state.mesas.map((m) => (m.id === id ? { ...m, estado } : m)),
          }));
        }
      });
    }
  },
}));
