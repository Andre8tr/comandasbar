// src/utils/products.ts
export const products = {
  cervezas: [
    { name: "Gallo", types: ["Botella", "Litro", "Lata"] },
    { name: "Cabro", types: ["Botella", "Litro", "Lata"] },
    { name: "Corona", types: ["Botella", "Litro", "Lata"] },
  ],
  bebidas: [
    "Cuba Libre",
    "Jagger Fresh",
    "Jagger Bomb",
    "Whisly",
    "Ron",
    "Bloody Mary",
    "Charro Negro",
  ],
  extras: ["Shot de Tequila", "Nachos Preparados", "Papas fritas", "Tostadas"],
  refrescos: ["Coca-Cola", "Agua Pura", "Sprite", "7-Up"],
};

// Nuevo: precios
export const productPrices: Record<string, number> = {
  "Gallo (Botella)": 15,
  "Gallo (Litro)": 25,
  "Gallo (Lata)": 12,
  "Cabro (Botella)": 15,
  "Cabro (Litro)": 25,
  "Cabro (Lata)": 12,
  "Corona (Botella)": 20,
  "Corona (Litro)": 30,
  "Corona (Lata)": 18,
  "Cuba Libre": 25,
  "Jagger Fresh": 30,
  "Jagger Bomb": 35,
  Whisly: 28,
  Ron: 20,
  "Bloody Mary": 26,
  "Charro Negro": 24,
  "Shot de Tequila": 12,
  "Nachos Preparados": 30,
  "Papas fritas": 20,
  Tostadas: 22,
  "Coca-Cola": 10,
  "Agua Pura": 8,
  Sprite: 10,
  "7-Up": 10,
};
