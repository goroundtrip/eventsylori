"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

interface TicketPurchaseFormProps {
  eventId: string;
  price: number;
  availableTickets: number;
}

export default function TicketPurchaseForm({
  eventId,
  price,
  availableTickets,
}: TicketPurchaseFormProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/tickets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          eventId,
          quantity,
        }),
      });

      if (response.ok) {
        router.push("/tickets");
        router.refresh();
      }
    } catch (error) {
      console.error("Error purchasing tickets:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6">
      <div>
        <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
          Quantity
        </label>
        <select
          id="quantity"
          name="quantity"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        >
          {[...Array(Math.min(availableTickets, 10))].map((_, i) => (
            <option key={i + 1} value={i + 1}>
              {i + 1}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-4">
        <p className="text-sm text-gray-500">
          Total: ${(price * quantity).toFixed(2)}
        </p>
      </div>

      <div className="mt-6">
        <button
          type="submit"
          disabled={loading || availableTickets === 0}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Processing..." : "Purchase Tickets"}
        </button>
      </div>
    </form>
  );
} 