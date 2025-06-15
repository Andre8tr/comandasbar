import ProductButton from './ProductButton';

export default function Category({
  category,
  onSelect,
}: {
  category: {
    name: string;
    items: { name: string; price: number }[];
  };
  onSelect: (p: { name: string; price: number }) => void;
}) {
  return (
    <div className="bg-white rounded-xl shadow p-4">
      <h2 className="text-lg font-bold mb-3">{category.name}</h2>
      <div className="grid grid-cols-2 gap-2">
        {category.items.map((item) => (
          <ProductButton key={item.name} item={item} onClick={() => onSelect(item)} />
        ))}
      </div>
    </div>
  );
}