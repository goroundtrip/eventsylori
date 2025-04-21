import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/lib/auth";
import Image from "next/image";
import { format } from "date-fns";
import Link from "next/link";

async function getTickets() {
  const res = await fetch('/api/tickets', {
    cache: "no-store",
  });
  return res.json();
}

export default async function TicketsPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/signin");
  }

  const tickets = await getTickets();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">My Tickets</h1>

      {tickets.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="mt-2 text-sm font-medium text-gray-900">No tickets</h3>
          <p className="mt-1 text-sm text-gray-500">
            You haven't purchased any tickets yet.
          </p>
          <div className="mt-6">
            <Link
              href="/"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Browse Events
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {tickets.map((ticket: any) => (
            <div
              key={ticket.id}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              {ticket.event.image && (
                <div className="relative h-48 w-full">
                  <Image
                    src={ticket.event.image}
                    alt={ticket.event.title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900">
                  {ticket.event.title}
                </h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    {format(new Date(ticket.event.date), "MMM d, yyyy h:mm a")}
                  </p>
                  <p className="text-sm text-gray-500">{ticket.event.location}</p>
                </div>
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-900">
                    Quantity: {ticket.quantity}
                  </p>
                  <p className="text-sm font-medium text-gray-900">
                    Total: ${(ticket.event.price * ticket.quantity).toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-500">
                    Status: {ticket.status}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 