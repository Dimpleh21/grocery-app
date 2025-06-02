"use client";

import { useEffect, useState } from "react";
import { Heart, ShoppingCart } from "lucide-react";
import Tabar from "./Tabar"; // Adjust the import path as necessary
import { useSearch } from "../../../context/SearchContext";
export default function Items() {
  const [items, setItems] = useState([]);
  const [category, setCategory] = useState("all");
  const [addedItems, setAddedItems] = useState({});
  const { searchQuery } = useSearch(); // ✅

  useEffect(() => {
    fetch(
      `https://uxdlyqjm9i.execute-api.eu-west-1.amazonaws.com/s?category=${category}`
    )
      .then((res) => res.json())
      .then((data) => setItems(data))
      .catch((err) => console.error("Failed to fetch items", err));
  }, [category]);

  const addToCart = (item) => {
    console.log("Adding to cart:", item);

    const existingCart = JSON.parse(localStorage.getItem("cartItems")) || [];
    console.log("Existing cart before add:", existingCart);

    const existingItem = existingCart.find((i) => i.id === item.id);

    if (!existingItem) {
      existingCart.push({
        ...item,
        quantity: 1,
      });
    } else {
      existingItem.quantity += 1;
    }

    localStorage.setItem("cartItems", JSON.stringify(existingCart));
    console.log("Updated cart saved:", existingCart);

    setAddedItems((prev) => {
      const updated = { ...prev, [item.id]: true };
      console.log("Updated addedItems:", updated);
      return updated;
    });
  };
  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  return (
    <div className="px-10 py-6 ">
      <div className="flex justify-between items-center mb-10">
        <Tabar onCategoryChange={setCategory} selectedCategory={category} />
      </div>
      <div className="font-semibold text-zinc-700 text-lg mb-4">
        Trending Items
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => {
          return (
            <div
              key={item.id}
              className="flex flex-col justify-between p-6 bg-white rounded-3xl shadow-md h-[300px]"
            >
              <div className="flex gap-6">
                <img
                  src={item.img}
                  alt={item.name}
                  className="w-36 h-36 object-contain mt-6"
                />

                {/* Right: Info */}
                <div className="flex flex-col flex-grow justify-between">
                  <div className="flex flex-col">
                    <div>
                      <div className="font-semibold text-zinc-800 text-md">
                        {item.name}
                      </div>
                      <p className="text-sm text-zinc-500 line-clamp-3">
                        {item.description}
                      </p>
                    </div>
                    <div className="mt-18 min-h-[32px] ">
                      {item.available && item.available >= 10 && (
                        <div className="inline-block bg-green-100 text-green-600 text-xs font-semibold px-3 py-1 rounded-full">
                          Available
                        </div>
                      )}
                      {item.available &&
                        item.available < 10 &&
                        item.available > 0 && (
                          <div className="inline-block bg-orange-100 text-orange-600 text-xs font-semibold px-3 py-1 rounded-full">
                            Only {item.available} left!
                          </div>
                        )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom: Price + Icons */}
              <div className="flex justify-between items-center mt-6">
                <div className="font-bold text-zinc-800 text-md">
                  {item.price}
                </div>
                <div className="flex gap-4">
                  {addedItems[item.id] ? (
                    <div className="text-xs text-blue-600 font-semibold">
                      Added to the cart!
                    </div>
                  ) : (
                    <ShoppingCart
                      className="w-5 h-5 text-zinc-500 hover:text-black cursor-pointer"
                      onClick={() => addToCart(item)}
                    />
                  )}
                  <Heart className="w-5 h-5 text-zinc-500 hover:text-red-500 cursor-pointer" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
