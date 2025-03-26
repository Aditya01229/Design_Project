"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    router.push("/");
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/">
          <span className="text-2xl font-bold text-blue-600 cursor-pointer">
            VIIT Alumni
          </span>
        </Link>
        <div className="flex space-x-6">
          {isLoggedIn ? (
            <>
              <Link href="/dashboard">
                <span className="hover:text-blue-500">Dashboard</span>
              </Link>
              <Link href="/activity">
                <span className="hover:text-blue-500">Recent Alumni Activity</span>
              </Link>
              <Link href="/community">  {/* ✅ Updated Correct Link */}
                <span className="hover:text-blue-500">Community</span>
              </Link>
              <Link href="/profile">
                <span className="hover:text-blue-500">Profile</span>
              </Link>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded-lg"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login">
                <span className="hover:text-blue-500">Login</span>
              </Link>
              <Link href="/signup">
                <span className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
                  Sign Up
                </span>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
