import Offers from "./Offers";
export default function Tabar({ onCategoryChange, selectedCategory }) {
  const categories = ["all", "fruit", "drinks", "bakery"];

  return (
    <div className="flex flex-col items-center justify-between gap-7">
      <div className="grid grid-cols-2 gap-4 mt-8 sm:flex sm:flex-row sm:gap-4">
        {categories.map((cat) => (
          <div
            key={cat}
            onClick={() => onCategoryChange(cat)}
            className={`px-8 py-2 border text-sm rounded-full shadow-sm cursor-pointer ${
              selectedCategory === cat
                ? "bg-black text-white border-black"
                : "border-zinc-300 text-zinc-700"
            }`}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </div>
        ))}
      </div>
      <div>
        <Offers />
      </div>
    </div>
  );
}
