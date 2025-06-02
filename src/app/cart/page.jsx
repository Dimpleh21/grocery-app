"use client";
import React, { useState, useEffect } from "react";

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [offers, setOffers] = useState([]);
  const [appliedOffers, setAppliedOffers] = useState([]);
  const [freeItemsDetails, setFreeItemsDetails] = useState([]);

  const normalize = (str) => str.trim().toLowerCase();

  const handleRemove = (id) => {
    setCartItems((prevItems) => {
      const updatedItems = prevItems.filter((item) => item.id !== id);
      localStorage.setItem("cartItems", JSON.stringify(updatedItems));
      return updatedItems;
    });
  };

  useEffect(() => {
    const savedOffers = JSON.parse(localStorage.getItem("offers")) || [];
    setOffers(savedOffers);
  }, []);

  useEffect(() => {
    const cartData = JSON.parse(localStorage.getItem("cartItems")) || [];
    setCartItems(cartData);
  }, []);

  useEffect(() => {
    if (!offers.length) return;

    const matches = [];

    offers.forEach((offer) => {
      const conditions = Array.isArray(offer.condition)
        ? offer.condition
        : [offer.condition];

      const allConditionsMet = conditions.every(({ item, buy }) => {
        const boughtItem = cartItems.find(
          (cartItem) =>
            normalize(cartItem.name) === normalize(item) &&
            cartItem.quantity >= buy
        );
        return Boolean(boughtItem);
      });

      if (allConditionsMet) {
        matches.push({
          title: offer.title,
          description: offer.description,
          reward: `${offer.condition.get} free ${offer.condition.freeItem}`,
          freeItem: offer.condition.freeItem,
        });
      }
    });

    setAppliedOffers(matches);
  }, [cartItems, offers]);

  useEffect(() => {
    if (!appliedOffers.length) {
      setFreeItemsDetails([]);
      return;
    }

    fetch(
      "https://uxdlyqjm9i.execute-api.eu-west-1.amazonaws.com/s?category=all"
    )
      .then((res) => res.json())
      .then((data) => {
        const freeDetails = appliedOffers
          .map(({ freeItem }) =>
            data.find(
              (product) => normalize(product.name) === normalize(freeItem)
            )
          )
          .filter(Boolean);

        setFreeItemsDetails(freeDetails);
      })
      .catch((err) => {
        console.error("Failed to fetch free item details:", err);
        setFreeItemsDetails([]);
      });
  }, [appliedOffers]);
  const combinedItems = [
    ...cartItems,
    ...freeItemsDetails.map((item) => ({
      ...item,
      isFree: true,
      quantity: 1,
      price: 0,
    })),
  ];

  const handleIncrease = (id) => {
    setCartItems((prevItems) => {
      const updatedItems = prevItems.map((item) => {
        if (item.id === id && item.available > 0) {
          return {
            ...item,
            quantity: item.quantity + 1,
            available: item.available - 1,
          };
        }
        return item;
      });
      localStorage.setItem("cartItems", JSON.stringify(updatedItems));
      return updatedItems;
    });
  };

  const handleDecrease = (id) => {
    setCartItems((prevItems) => {
      const updatedItems = prevItems.map((item) => {
        if (item.id === id && item.quantity > 1) {
          return {
            ...item,
            quantity: item.quantity - 1,
            available: item.available + 1,
          };
        }
        return item;
      });
      localStorage.setItem("cartItems", JSON.stringify(updatedItems));
      return updatedItems;
    });
  };

  const totalAmount = cartItems
    .reduce((acc, item) => {
      const price =
        Number(item.price.toString().replace(/[^0-9.-]+/g, "")) || 0;
      const quantity = Number(item.quantity) || 0;
      return acc + price * quantity;
    }, 0)
    .toFixed(2);

  return (
    <div className="p-6 sm:p-10 max-w-4xl mx-auto">
      <div className="font-semibold text-lg mb-6">Your Cart</div>

      {combinedItems.length === 0 && (
        <div className="text-zinc-500">Your cart is currently empty.</div>
      )}

      {appliedOffers.length > 0 && (
        <div className="mt-6">
          <div className="font-semibold text-zinc-700 text-lg mb-2">
            🎉 You’ve unlocked these offers:
          </div>
          <ul className="space-y-2">
            {appliedOffers.map((offer, index) => (
              <li
                key={index}
                className="bg-yellow-50 border border-yellow-300 p-3 rounded-md text-sm text-yellow-800"
              >
                <strong>{offer.title}:</strong> {offer.description} —{" "}
                <span className="font-medium">{offer.reward}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {combinedItems.length > 0 && (
        <>
          <div className="mt-6">
            <div className="font-semibold text-zinc-700 text-lg mb-4">
              Items in Cart
            </div>
            <ul className="space-y-4">
              {combinedItems.map((item) => (
                <li
                  key={item.id + (item.isFree ? "-free" : "")}
                  className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 bg-white rounded-lg shadow-sm"
                >
                  <div className="flex items-center gap-4 w-full sm:w-auto">
                    <img
                      src={item.img}
                      alt={item.name}
                      className="w-16 h-16 object-contain flex-shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="font-semibold text-zinc-800 truncate">
                        {item.name}{" "}
                        {item.isFree && (
                          <span className="ml-2 px-2 py-1 text-xs rounded bg-yellow-300 text-yellow-900 font-semibold">
                            Free Item
                          </span>
                        )}
                      </div>
                      <div className="text-zinc-500">
                        ${item.isFree ? "0.00" : item.price}
                      </div>
                      {!item.isFree && (
                        <div className="text-sm mt-1">
                          {item.available < 10 ? (
                            <span className="text-red-500 font-medium">
                              Only {item.available} left!
                            </span>
                          ) : (
                            <span className="text-green-600 font-medium bg-green-100 px-2 py-1 rounded-full text-xs">
                              Available
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {!item.isFree && (
                    <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 mt-4 sm:mt-0">
                      <button
                        onClick={() => handleDecrease(item.id)}
                        className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
                        disabled={item.quantity <= 1}
                      >
                        -
                      </button>
                      <div className="text-zinc-600 min-w-[60px] text-center">
                        Qty: {item.quantity}
                      </div>
                      <button
                        onClick={() => handleIncrease(item.id)}
                        className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
                        disabled={item.available <= 0}
                      >
                        +
                      </button>

                      {/* Remove Button */}
                      <button
                        onClick={() => handleRemove(item.id)}
                        className="ml-0 sm:ml-4 h-6 w-6 bg-red-800 text-white hover:bg-red-900 rounded-full cursor-pointer"
                        aria-label="Remove item"
                      >
                        x
                      </button>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-8 text-right font-semibold text-xl text-zinc-800">
            Total Amount: ${totalAmount}
          </div>

          <div className="mt-4 text-right">
            <button
              onClick={() =>
                alert("Checkout functionality not implemented yet!")
              }
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-lg w-full sm:w-auto"
            >
              Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
}
