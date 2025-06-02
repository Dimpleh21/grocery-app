"use client";
import { useState } from "react";
import Image from "next/image";
import avatarIcon from "../../../public/avatar.png";
import { Heart, ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSearch } from "../../../context/SearchContext";
export default function Navbar() {
  const router = useRouter();
  const { setSearchQuery } = useSearch();
  const [input, setInput] = useState("");

  return (
    <div>
      <div className="hidden sm:flex flex-row gap-28 items-center">
        <div
          className="font-semibold text-lg ml-2 cursor-pointer"
          onClick={() => router.push("/")}
        >
          GROCERIES
        </div>

        <div className="py-3 px-5 w-[500px] border border-zinc-200 rounded-2xl shadow-md">
          <input
            type="text"
            placeholder="Search products"
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              setSearchQuery(e.target.value);
            }}
            className="w-full bg-transparent outline-none text-zinc-700 placeholder-zinc-400"
          />
        </div>

        <div className="flex items-center gap-6">
          <div className="relative">
            <Heart className="text-red-500 w-6 h-6" />
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1.5">
              8
            </span>
          </div>

          <div className="w-8 h-8 rounded-full border-2 border-blue-400 overflow-hidden">
            <Image src={avatarIcon} alt="Avatar" width={32} height={32} />
          </div>

          <div
            className="relative cursor-pointer"
            onClick={() => router.push("/cart")}
          >
            <ShoppingCart className="text-gray-700 w-6 h-6" />
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:hidden px-4 py-2 ">
        <div className="flex items-center justify-between">
          <div
            className="font-semibold text-lg ml-2 cursor-pointer"
            onClick={() => router.push("/")}
          >
            GROCERIES
          </div>
          <div
            className="relative cursor-pointer"
            onClick={() => router.push("/cart")}
          >
            <ShoppingCart className="text-gray-700 w-6 h-6" />
          </div>
        </div>
        <div className="py-3 px-5 w-[250px] border border-zinc-200 rounded-2xl shadow-md mt-4">
          <input
            type="text"
            placeholder="Search products"
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              setSearchQuery(e.target.value);
            }}
            className="w-full bg-transparent outline-none text-zinc-700 placeholder-zinc-400"
          />
        </div>
      </div>
    </div>
  );
}
