"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Home() {
  const router = useRouter();
  const [user, setUser] = useState(false);

  useEffect(() => {
    // Check if a token exists in localStorage (user is logged in)
    const token = localStorage.getItem("token");
    if (token) {
      setUser(true);
      router.push("/dashboard");
    }
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="max-w-2xl bg-white shadow-md rounded-lg p-6 text-center">
        <h1 className="text-4xl font-bold text-blue-600 mb-4">
          Welcome to VIIT Alumni Association
        </h1>
        <p className="text-gray-700 mb-4">
          Connect with alumni, explore career opportunities, and stay updated on events.
        </p>
        {!user ? (
          <div className="flex space-x-4">
            <Link href="/signup">
              <button className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                Sign Up
              </button>
            </Link>
            <Link href="/login">
              <button className="px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800">
                Login
              </button>
            </Link>
          </div>
        ) : (
          <p className="text-green-600">Redirecting to dashboard...</p>
        )}
      </div>
    </div>
  );
}
