import React from "react";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/lib/auth";
import { format } from "date-fns";
import Image from "next/image";
import Link from "next/link";

async function getEvent(eventId: string) {
  const res = await fetch(`${process.env.NEXTAUTH_URL}/api/events/${eventId}`, {
    cache: "no-store",
  });
  return res.json();
}

async function getEventTickets(eventId: string) {
  const res = await fetch(`${process.env.NEXTAUTH_URL}/api/events/${eventId}/tickets`, {
    cache: "no-store",
  });
  return res.json();
}

export default async function ManageEventPage({
  params,
}: {
  params: { eventId: string };
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/signin");
  }

  const event = await getEvent(params.eventId);
  const tickets = await getEventTickets(params.eventId);

  // Check if the current user is the event creator
  if (event.creatorId !== session.user.id) {
    redirect("/");
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Manage Event</h1>
        <div className="flex gap-4">
          <Link
            href={`/events/${params.eventId}/edit`}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Edit Event
          </Link>
          <button
            onClick={() => {
              // TODO: Implement cancel event functionality
            }}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700"
          >
            Cancel Event
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Event Details</h2>
            {event.image && (
              <div className="relative h-64 w-full rounded-lg overflow-hidden mb-4">
                <Image
                  src={event.image}
                  alt={event.title}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <h3 className="text-xl font-semibold text-gray-900">{event.title}</h3>
            <p className="text-gray-600 mt-2">{event.description}</p>
            <div className="mt-4 space-y-2">
              <p className="text-gray-600">
                <span className="font-medium">Date:</span>{" "}
                {format(new Date(event.date), "MMM d, yyyy h:mm a")}
              </p>
              <p className="text-gray-600">
                <span className="font-medium">Location:</span> {event.location}
              </p>
              <p className="text-gray-600">
                <span className="font-medium">Price:</span> ${event.price.toFixed(2)}
              </p>
              <p className="text-gray-600">
                <span className="font-medium">Capacity:</span> {event.capacity}
              </p>
              <p className="text-gray-600">
                <span className="font-medium">Available Tickets:</span>{" "}
                {event.availableTickets}
              </p>
            </div>
          </div>
        </div>

        <div>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Ticket Sales</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">Total Tickets Sold</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {tickets.reduce((sum: number, ticket: any) => sum + ticket.quantity, 0)}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">Total Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ${(tickets.reduce((sum: number, ticket: any) => sum + (ticket.quantity * event.price), 0)).toFixed(2)}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">Available Tickets</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {event.availableTickets}
                  </p>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Purchases</h3>
                <div className="space-y-4">
                  {tickets.map((ticket: any) => (
                    <div
                      key={ticket.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <p className="font-medium text-gray-900">
                          {ticket.user.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {ticket.quantity} ticket{ticket.quantity > 1 ? "s" : ""}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900">
                          ${(ticket.quantity * event.price).toFixed(2)}
                        </p>
                        <p className="text-sm text-gray-500">
                          {format(new Date(ticket.createdAt), "MMM d, yyyy")}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 