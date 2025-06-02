"use client";
import React from "react";
import { useRouter } from "next/navigation";
export default function ViewCart() {
  const router = useRouter();
  return (
    <div
      className="
        fixed 
        bottom-10
        right-10 
        bg-blue-600 
        text-white 
        px-5 
        py-3 
        rounded-lg 
        shadow-lg 
        cursor-pointer 
        z-50
        hover:bg-blue-700
        transition
        "
      onClick={() => router.push("/cart")}
    >
      Go to Cart
    </div>
  );
}
