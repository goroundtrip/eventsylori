import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/lib/auth";
import CreateEventForm from "@/components/events/CreateEventForm";

export default async function NewEventPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/signin");
  }

  return (
    <div className="max-w-2xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
          Create New Event
        </h1>
        <p className="mt-3 text-xl text-gray-500 sm:mt-4">
          Fill in the details below to create your event
        </p>
      </div>

      <div className="mt-12">
        <CreateEventForm />
      </div>
    </div>
  );
} 