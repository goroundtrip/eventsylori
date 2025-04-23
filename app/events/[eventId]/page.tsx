export const dynamic = "force-dynamic";

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";
import Image from "next/image";
import { format } from "date-fns";
import TicketPurchaseForm from "@/components/events/TicketPurchaseForm";

async function getEvent(eventId: string) {
  const res = await fetch(`${process.env.NEXTAUTH_URL}/api/events/${eventId}`, {
    cache: "no-store",
  });
  return res.json();
}

export default async function EventPage({
  params,
}: {
  params: { eventId: string };
}) {
  const session = await getServerSession(authOptions);
  const event = await getEvent(params.eventId);

  if (!event) {
    return <div>Event not found</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          {event.image && (
            <div className="relative h-96 w-full rounded-lg overflow-hidden">
              <Image
                src={event.image}
                alt={event.title}
                fill
                className="object-cover"
              />
            </div>
          )}
          <div className="mt-8">
            <h1 className="text-3xl font-bold text-gray-900">{event.title}</h1>
            <div className="mt-4 flex items-center space-x-4">
              <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
                {event.category}
              </span>
              <span className="text-sm font-medium text-gray-500">
                {format(new Date(event.date), "MMM d, yyyy h:mm a")}
              </span>
            </div>
            <div className="mt-6">
              <h2 className="text-xl font-semibold text-gray-900">About this event</h2>
              <p className="mt-2 text-gray-600">{event.description}</p>
            </div>
            <div className="mt-6">
              <h2 className="text-xl font-semibold text-gray-900">Location</h2>
              <p className="mt-2 text-gray-600">{event.location}</p>
            </div>
            <div className="mt-6">
              <h2 className="text-xl font-semibold text-gray-900">Organizer</h2>
              <div className="mt-2 flex items-center">
                {event.creator.image && (
                  <Image
                    className="h-10 w-10 rounded-full"
                    src={event.creator.image}
                    alt={event.creator.name || "Creator"}
                    width={40}
                    height={40}
                  />
                )}
                <p className="ml-3 text-gray-600">{event.creator.name}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:sticky lg:top-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900">Tickets</h2>
            <div className="mt-4">
              <p className="text-3xl font-bold text-gray-900">
                ${event.price.toFixed(2)}
              </p>
              <p className="mt-2 text-gray-600">
                {event.availableTickets} tickets available
              </p>
            </div>
            {session ? (
              <TicketPurchaseForm
                eventId={event.id}
                price={event.price}
                availableTickets={event.availableTickets}
              />
            ) : (
              <div className="mt-6">
                <p className="text-gray-600">
                  Please sign in to purchase tickets
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 