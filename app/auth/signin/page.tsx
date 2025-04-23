export const dynamic = "force-dynamic";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth"; // Update the path if authOptions is located elsewhere
import { redirect } from "next/navigation";

export default async function SignIn() {
  const session = await getServerSession(authOptions); // ✅ Correct usage

  if (session) {
    redirect("/"); // Redirect to home or dashboard if user is already logged in
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="p-6 bg-white rounded-xl shadow-md w-full max-w-md text-center">
        <h1 className="text-2xl font-bold mb-4">Sign In</h1>
        <p className="mb-6 text-gray-600">Please sign in using one of the following providers:</p>
        <a
          href="/api/auth/signin/google"
          className="block w-full bg-blue-500 text-white py-2 px-4 rounded mb-3 hover:bg-blue-600 transition"
        >
          Sign in with Google
        </a>
        <a
          href="/api/auth/signin/twitter"
          className="block w-full bg-blue-400 text-white py-2 px-4 rounded hover:bg-blue-500 transition"
        >
          Sign in with Twitter
        </a>
      </div>
    </div>
  );
}
