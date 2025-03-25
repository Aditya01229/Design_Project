"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkLoginStatus = () => {
      const token = localStorage.getItem("token");
      setIsLoggedIn(!!token);
    };

    checkLoginStatus();
    window.addEventListener("storage", checkLoginStatus); // Update state when localStorage changes

    return () => {
      window.removeEventListener("storage", checkLoginStatus);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    router.push("/");
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link href="/">
          <span className="text-2xl font-bold text-blue-600 cursor-pointer">
            VIIT Alumni
          </span>
        </Link>

        {/* Navigation Links */}
        <div className="flex space-x-6">
          {isLoggedIn ? (
            <>
              <Link href="/dashboard" className="hover:text-blue-500">Dashboard</Link>
              <Link href="/activity" className="hover:text-blue-500">Recent Alumni Activity</Link>
              <Link href="/communities" className="hover:text-blue-500">Communities</Link>
              <Link href="/profile" className="hover:text-blue-500">Profile</Link>

              <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded-lg">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="hover:text-blue-500">Login</Link>
              <Link href="/signup" className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
