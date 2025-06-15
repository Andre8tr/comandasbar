'use client';

import { useState } from 'react';

export default function ProductButton({
  item,
  onClick,
}: {
  item: { name: string; price: number };
  onClick: () => void;
}) {
  const [clicked, setClicked] = useState(false);

  const handleClick = () => {
    setClicked(true);
    onClick();
    setTimeout(() => setClicked(false), 150);
  };

  return (
    <button
      onClick={handleClick}
      className={`px-2 py-2 rounded-lg text-white font-medium transition duration-150 ${
        clicked ? 'bg-blue-800' : 'bg-blue-600 hover:bg-blue-700'
      }`}
    >
      {item.name} - Q{item.price}
    </button>
  );
}