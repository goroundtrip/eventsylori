import React from "react";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { format } from "date-fns";
import Image from "next/image";
import Link from "next/link";

async function getOrganizerEvents(userId: string) {
  const res = await fetch(`${process.env.NEXTAUTH_URL}/api/organizer/events`, {
    cache: "no-store",
  });
  return res.json();
}

export default async function OrganizerDashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "organizer") {
    redirect("/");
  }

  const events = await getOrganizerEvents(session.user.id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Events</h1>
        <Link
          href="/events/new"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
        >
          Create New Event
        </Link>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {events.map((event: any) => (
            <li key={event.id}>
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    {event.image && (
                      <div className="flex-shrink-0 h-12 w-12 relative">
                        <Image
                          src={event.image}
                          alt={event.title}
                          fill
                          className="rounded-full object-cover"
                        />
                      </div>
                    )}
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">
                        {event.title}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {format(new Date(event.date), "MMM d, yyyy h:mm a")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        event.status === "approved"
                          ? "bg-green-100 text-green-800"
                          : event.status === "rejected"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {event.status}
                    </span>
                    <Link
                      href={`/events/${event.id}/manage`}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      Manage
                    </Link>
                  </div>
                </div>
                <div className="mt-2 sm:flex sm:justify-between">
                  <div className="sm:flex">
                    <p className="flex items-center text-sm text-gray-500">
                      {event.location}
                    </p>
                    <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                      ${event.price.toFixed(2)} • {event.capacity} capacity
                    </p>
                  </div>
                  <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                    {event.tickets.length} tickets sold
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
} 