"use client";
import React, { useEffect, useState } from "react";
import { Package, Coffee } from "lucide-react";

export default function Offers() {
  const rawOffers = [
    {
      id: "croissant-offer",
      icon: "coffee",
      title: "Buy 3 Croissants",
      description: "Get a free Coffee",
      condition: {
        item: "Croissants",
        buy: 3,
        get: 1,
        freeItem: "Coffee",
      },
    },
    {
      id: "coke-offer",
      icon: "package",
      title: "Buy 6 Coca-Cola",
      description: "Get 1 Coca-Cola free",
      condition: {
        item: "Coca-Cola",
        buy: 6,
        get: 1,
        freeItem: "Coca-Cola",
      },
    },
  ];

  const [offers, setOffers] = useState([]);

  useEffect(() => {
    const existing = localStorage.getItem("offers");
    console.log("Existing offers in localStorage:", rawOffers);
    localStorage.setItem("offers", JSON.stringify(rawOffers));
    setOffers(rawOffers);
  }, []);

  const renderIcon = (icon) => {
    if (icon === "package")
      return <Package className="w-4 h-4 text-green-600" />;
    if (icon === "coffee") return <Coffee className="w-4 h-4 text-brown-500" />;
    return null;
  };

  return (
    <div className="p-4 rounded-lg border border-zinc-200 bg-white w-full max-w-3xl mx-auto">
      <h2 className="text-lg font-medium text-zinc-800 mb-3">Offers</h2>
      <div className="flex flex-col sm:flex-row gap-4 overflow-x-auto sm:overflow-x-visible">
        {offers.map((offer) => (
          <div
            key={offer.id}
            className="flex items-start gap-2 p-3 border border-zinc-100 rounded-md shadow-sm bg-zinc-50"
          >
            <span className="mt-1 shrink-0">{renderIcon(offer.icon)}</span>
            <div>
              <div className="font-medium text-zinc-700 text-sm sm:text-base">
                {offer.title}
              </div>
              <div className="text-xs text-zinc-500">{offer.description}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
