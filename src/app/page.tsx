"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, GraduationCap, Users, Calendar } from "lucide-react";

export default function Home() {
  const router = useRouter();
  const [user, setUser] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if a token exists in localStorage (user is logged in)
    const token = localStorage.getItem("token");
    if (token) {
      setUser(true);
      router.push("/dashboard");
    }
    setLoading(false);
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="animate-pulse text-indigo-600 text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex flex-col">
      <header className="py-8 text-center">
        <GraduationCap className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
        <h1 className="text-5xl font-extrabold text-gray-800">
          VIIT Alumni <span className="text-indigo-600">Association</span>
        </h1>
        <p className="text-gray-600 text-xl mt-4 max-w-2xl mx-auto">
          Connect with alumni, explore career opportunities, and stay updated on events.
        </p>
      </header>

      <main className="flex-grow flex flex-col items-center justify-center px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl">
          <div className="bg-indigo-50 p-8 rounded-xl flex flex-col items-center text-center">
            <Users className="h-10 w-10 text-indigo-600 mb-4" />
            <h3 className="font-semibold text-gray-800 text-2xl mb-2">Network</h3>
            <p className="text-gray-600 text-base">
              Connect with alumni across industries and locations.
            </p>
          </div>

          <div className="bg-indigo-50 p-8 rounded-xl flex flex-col items-center text-center">
            <Calendar className="h-10 w-10 text-indigo-600 mb-4" />
            <h3 className="font-semibold text-gray-800 text-2xl mb-2">Events</h3>
            <p className="text-gray-600 text-base">
              Participate in reunions, webinars and workshops.
            </p>
          </div>

          <div className="bg-indigo-50 p-8 rounded-xl flex flex-col items-center text-center">
            <ArrowRight className="h-10 w-10 text-indigo-600 mb-4" />
            <h3 className="font-semibold text-gray-800 text-2xl mb-2">Opportunities</h3>
            <p className="text-gray-600 text-base">
              Discover job openings and mentorship programs.
            </p>
          </div>
        </div>

        {!user ? (
          <div className="flex flex-col sm:flex-row gap-6 mt-12">
            <Link href="/signup">
              <button className="w-full sm:w-auto px-10 py-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg font-medium">
                Sign Up
              </button>
            </Link>
            <Link href="/login">
              <button className="w-full sm:w-auto px-10 py-4 bg-white text-indigo-600 border border-indigo-200 rounded-lg hover:bg-indigo-50 transition-all duration-200 shadow-sm hover:shadow-md font-medium">
                Login
              </button>
            </Link>
          </div>
        ) : (
          <div className="mt-12 text-center">
            <div className="inline-block px-6 py-3 bg-indigo-100 text-indigo-700 rounded-lg">
              <div className="flex items-center justify-center">
                <div className="mr-3 h-3 w-3 rounded-full bg-indigo-600 animate-pulse"></div>
                Redirecting to dashboard...
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="py-4 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} VIIT Alumni Association. All rights reserved.
      </footer>
    </div>
  );
}
