"use client";

import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";

interface EventCardProps {
  event: {
    id: string;
    title: string;
    description: string;
    date: string;
    location: string;
    image: string | null;
    price: number;
    capacity: number;
    category: string;
    creator: {
      name: string | null;
      image: string | null;
    };
  };
}

export default function EventCard({ event }: EventCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {event.image && (
        <div className="relative h-48 w-full">
          <Image
            src={event.image}
            alt={event.title}
            fill
            className="object-cover"
          />
        </div>
      )}
      <div className="p-6">
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
            {event.category}
          </span>
          <span className="text-sm font-medium text-gray-500">
            {format(new Date(event.date), "MMM d, yyyy h:mm a")}
          </span>
        </div>
        <Link href={`/events/${event.id}`} className="block mt-2">
          <h3 className="text-xl font-semibold text-gray-900 hover:text-indigo-600">
            {event.title}
          </h3>
        </Link>
        <p className="mt-3 text-base text-gray-500 line-clamp-2">
          {event.description}
        </p>
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              {event.creator.image && (
                <Image
                  className="h-10 w-10 rounded-full"
                  src={event.creator.image}
                  alt={event.creator.name || "Creator"}
                  width={40}
                  height={40}
                />
              )}
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">
                {event.creator.name}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-gray-900">
              ${event.price.toFixed(2)}
            </p>
            <p className="text-sm text-gray-500">
              {event.capacity} spots available
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 