'use client'

import { useSession } from 'next-auth/react'
import ProtectedRoute from '@/components/ProtectedRoute'
import Link from 'next/link'

export default function Dashboard() {
  const { data: session } = useSession()

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">
              Welcome back, {session?.user?.name}!
            </h1>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {/* Quick Access Cards */}
              <Link
                href="/events"
                className="bg-white overflow-hidden shadow rounded-lg hover:shadow-lg transition-shadow duration-200"
              >
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg font-medium text-gray-900">
                    Discover Events
                  </h3>
                  <p className="mt-2 text-sm text-gray-500">
                    Explore upcoming events and find your next experience
                  </p>
                </div>
              </Link>

              <Link
                href="/my-tickets"
                className="bg-white overflow-hidden shadow rounded-lg hover:shadow-lg transition-shadow duration-200"
              >
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg font-medium text-gray-900">
                    My Tickets
                  </h3>
                  <p className="mt-2 text-sm text-gray-500">
                    View and manage your event tickets
                  </p>
                </div>
              </Link>

              <Link
                href="/create-event"
                className="bg-white overflow-hidden shadow rounded-lg hover:shadow-lg transition-shadow duration-200"
              >
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg font-medium text-gray-900">
                    Create Event
                  </h3>
                  <p className="mt-2 text-sm text-gray-500">
                    Start organizing your own event
                  </p>
                </div>
              </Link>

              <Link
                href="/my-subscriptions"
                className="bg-white overflow-hidden shadow rounded-lg hover:shadow-lg transition-shadow duration-200"
              >
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg font-medium text-gray-900">
                    My Subscriptions
                  </h3>
                  <p className="mt-2 text-sm text-gray-500">
                    Manage your event subscriptions
                  </p>
                </div>
              </Link>

              <Link
                href="/saved-events"
                className="bg-white overflow-hidden shadow rounded-lg hover:shadow-lg transition-shadow duration-200"
              >
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg font-medium text-gray-900">
                    Saved Events
                  </h3>
                  <p className="mt-2 text-sm text-gray-500">
                    View your saved events
                  </p>
                </div>
              </Link>

              <Link
                href="/profile"
                className="bg-white overflow-hidden shadow rounded-lg hover:shadow-lg transition-shadow duration-200"
              >
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg font-medium text-gray-900">
                    Profile Settings
                  </h3>
                  <p className="mt-2 text-sm text-gray-500">
                    Update your profile information
                  </p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
} 