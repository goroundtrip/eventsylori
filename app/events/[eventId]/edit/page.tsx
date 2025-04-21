import React from "react";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/lib/auth";
import EventForm from "@/components/events/EventForm";

async function getEvent(eventId: string) {
  const res = await fetch(`${process.env.NEXTAUTH_URL}/api/events/${eventId}`, {
    cache: "no-store",
  });
  return res.json();
}

export default async function EditEventPage({
  params,
}: {
  params: { eventId: string };
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/signin");
  }

  const event = await getEvent(params.eventId);

  // Check if the current user is the event creator
  if (event.creatorId !== session.user.id) {
    redirect("/");
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Edit Event</h1>
        <Link
          href={`/events/${params.eventId}/manage`}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
        >
          Back to Management
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <EventForm event={event} />
      </div>
    </div>
  );
} 