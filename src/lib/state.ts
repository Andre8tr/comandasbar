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

type EstadoMesa = "rojo" | "amarillo" | "verde" | "despachado";
type EstadoPedido = "pendiente" | "despachado";

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
  estado: EstadoPedido;
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
  despacharPedido: (id: string, pedidoIndex: number) => void;
  limpiarOrden: (id: string) => void;
  completarMesa: (id: string) => void;
  syncMesasWithFirestore: () => void;
}

export const useMesaStore = create<MesaState>((set, get) => {
  const updateMesaEstado = (
    id: string,
    pedidos: Pedido[],
    ordenActual: OrdenItem[]
  ): EstadoMesa => {
    if (ordenActual.length > 0) return "rojo";
    if (pedidos.some((p) => p.estado === "pendiente")) return "amarillo";
    if (pedidos.length > 0 && pedidos.every((p) => p.estado === "despachado"))
      return "despachado";
    return "verde";
  };

  return {
    mesas: Array.from({ length: 9 }, (_, i) => ({
      id: `${i + 1}`,
      estado: "verde" as EstadoMesa,
    })),

    setEstadoMesa: (id, estado) =>
      set((state) => ({
        mesas: state.mesas.map((m) => (m.id === id ? { ...m, estado } : m)),
      })),

    productos: [
      {
        name: "Cervezas 🍺",
        items: [
          { name: "Gallo Litro", price: 35 },
          { name: "Cabro Litro", price: 35 },
          { name: "Oferta Litros", price: 60 },
          { name: "Gallo Botella", price: 18 },
          { name: "Cabro Botella", price: 18 },
          { name: "Cabro Reserva Botella", price: 25 },
          { name: "Corona Botella", price: 15 },
          { name: "Monte Carlo Botella", price: 15 },
        ],
      },
      {
        name: "Tragos Preparados 🍹",
        items: [
          { name: "Jagger Soda", price: 30 },
          { name: "Jagger Bomb", price: 35 },
          { name: "Bloody Mary", price: 30 },
          { name: "Caipirinha", price: 25 },
          { name: "Mojito", price: 30 },
          { name: "Cuba Libre", price: 20 },
          { name: "Quetalteca Sabor", price: 16 },
          { name: "Shot Tequila Jimador", price: 10 },

          { name: "Quetzalteca Tinaja (8U - 3Aguas)", price: 130 },
          { name: "Michelada", price: 35 },
          { name: "Gaseosas", price: 10 },
          { name: "Charro Negro", price: 25 },
          { name: "Cimarrona", price: 20 },
          { name: "Jugo Vegetales Preparado", price: 25 },
          { name: "Agua Pura", price: 5 },
          { name: "Whisky E. Roja", price: 25 },
        ],
      },
      {
        name: "Comida 🍔",
        items: [
          { name: "Papas Fritas", price: 15 },
          { name: "Papas Especiales", price: 15 },
          { name: "Nachos Preparados", price: 30 },
          { name: "Tostadas", price: 20 },
          { name: "Alitas 6/u", price: 35 },
          { name: "Alitas 10/u", price: 50 },
          { name: "Sandwich Jamón y Queso", price: 25 },
          { name: "Derretido", price: 25 },
          { name: "Pizza Dog", price: 25 },
          { name: "Hamburguesa", price: 25 },
        ],
      },
      {
        name: "Botellas Ron 🥃",
        items: [
          { name: "Ron Bacardi", price: 170 },
          { name: "Ron Botran 12 años", price: 225 },
          { name: "Pulmon Quetzalteca", price: 160 },
          { name: "Ron XL", price: 210 },
          { name: "Venado Especial", price: 120 },
        ],
      },
      {
        name: "Botellas Tequila 🔥",
        items: [
          { name: "El Jimador Blanco", price: 250 },
          { name: "Jose Cuervo Reposado", price: 300 },
          { name: "Don Julio", price: 950 },
          { name: "1800 Cristalino", price: 525 },
        ],
      },
      {
        name: "Botellas Whisky 🥃",
        items: [
          { name: "Johnnie Walker E. Roja", price: 350 },
          { name: "Johnnie Walker E. Negra", price: 700 },
          { name: "Old Parr", price: 600 },
          { name: "Jack Daniels", price: 600 },
        ],
      },
      {
        name: "Botellas Varias 🍸",
        items: [
          { name: "Vodka Finlandia", price: 350 },
          { name: "Jägermeister", price: 580 },
        ],
      },
      {
        name: "Extras 🚬",
        items: [
          { name: "Cigarros 3u", price: 10 },
          { name: "Vaso quebrado", price: 25 },
          { name: "Descorche de botella", price: 100 }, // ← añadido
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
      const nuevoPedido: Pedido = {
        items: actual,
        total,
        nota,
        estado: "pendiente",
      };
      const previos = get().ordenes[id] || [];
      const nuevosPedidos: Pedido[] = [...previos, nuevoPedido];

      set((state) => ({
        ordenes: { ...state.ordenes, [id]: nuevosPedidos },
        ordenActual: { ...state.ordenActual, [id]: [] },
        mesas: state.mesas.map((m) =>
          m.id === id ? { ...m, estado: "amarillo" } : m
        ),
      }));

      await setDoc(doc(db, "mesas", id), {
        pedidos: nuevosPedidos,
        ordenActual: [],
      });
    },

    despacharPedido: (id, pedidoIndex) => {
      const pedidos = get().ordenes[id] || [];
      const actualizados: Pedido[] = pedidos.map((p, i) =>
        i === pedidoIndex ? { ...p, estado: "despachado" } : p
      );

      const estado = updateMesaEstado(
        id,
        actualizados,
        get().ordenActual[id] || []
      );

      set((state) => ({
        ordenes: { ...state.ordenes, [id]: actualizados },
        mesas: state.mesas.map((m) => (m.id === id ? { ...m, estado } : m)),
      }));

      updateDoc(doc(db, "mesas", id), { pedidos: actualizados });
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

      updateDoc(doc(db, "mesas", id), {
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
            const estado = updateMesaEstado(id, pedidos, ordenActual);

            set((state) => ({
              ordenActual: { ...state.ordenActual, [id]: ordenActual },
              ordenes: { ...state.ordenes, [id]: pedidos },
              mesas: state.mesas.map((m) =>
                m.id === id ? { ...m, estado } : m
              ),
            }));
          }
        });
      }
    },
  };
});
