import React from 'react';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/app/lib/auth';
import { prisma } from '@/app/lib/prisma';

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  price: number;
  capacity: number;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled'; // Ensure this matches your schema
  image: string | null;
  category: string;
  creator: {
    name: string | null;
    email: string | null;
  };
}

export default async function AdminEventPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);

  if (!session?.user || session.user.role !== 'admin') {
    redirect('/');
  }

  const event = await prisma.event.findUnique({
    where: { id: params.id },
    include: {
      creator: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  });

  if (!event) {
    return <div>Event not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Event Details</h1>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-2xl font-semibold mb-4">{event.title}</h2>
            <p className="text-gray-600 mb-4">{event.description}</p>

            <div className="space-y-2">
              <p><span className="font-semibold">Date:</span> {new Date(event.date).toLocaleDateString()}</p>
              <p><span className="font-semibold">Location:</span> {event.location}</p>
              <p><span className="font-semibold">Price:</span> ${event.price}</p>
              <p><span className="font-semibold">Capacity:</span> {event.capacity}</p>
              <p><span className="font-semibold">Status:</span> {event.status}</p>
              <p><span className="font-semibold">Category:</span> {event.category}</p>
              {event.image && (
                <div>
                  <span className="font-semibold">Image:</span><br />
                  <img src={event.image} alt={event.title} className="mt-2 max-w-xs rounded shadow" />
                </div>
              )}
            </div>
          </div>

          <div>
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Organizer Information</h3>
              <p><span className="font-semibold">Name:</span> {event.creator.name}</p>
              <p><span className="font-semibold">Email:</span> {event.creator.email}</p>
            </div>

            <div className="space-y-4">
              <button
                onClick={() => handleApprove(event.id)}
                className="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
              >
                Approve Event
              </button>
              <button
                onClick={() => handleReject(event.id)}
                className="w-full bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
              >
                Reject Event
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

async function handleApprove(eventId: string) {
  'use server';
  await prisma.event.update({
    where: { id: eventId },
    data: { status: 'approved' },
  });
}

async function handleReject(eventId: string) {
  'use server';
  await prisma.event.update({
    where: { id: eventId },
    data: { status: 'rejected' },
  });
}
