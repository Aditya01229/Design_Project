/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  GraduationCap,
  Menu,
  X,
  User,
  LayoutDashboard,
  Users,
  Activity,
  LogOut,
  Search,
} from "lucide-react";
import jwt from "jsonwebtoken"; // Import jwt for decoding tokens

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkLoginStatus = () => {
      const token = localStorage.getItem("token");
      setIsLoggedIn(!!token);

      if (token) {
        try {
          const decodedToken: any = jwt.decode(token);
          setIsAdmin(decodedToken.userType === "ADMIN");
        } catch {
          console.error("Error decoding token");
        }
      } else {
        setIsAdmin(false);
      }
    };

    checkLoginStatus();
    window.addEventListener("storage", checkLoginStatus);
    return () => window.removeEventListener("storage", checkLoginStatus);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setIsAdmin(false);
    router.push("/");
    setMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => setMobileMenuOpen((open) => !open);

  const handleSearchChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchText(value);

    if (value.length > 1) {
      const res = await fetch(`/api/user/search?q=${value}`);
      const data = await res.json();
      setSearchResults(data);
      setShowDropdown(true);
    } else {
      setSearchResults([]);
      setShowDropdown(false);
    }
  };

  const handleSelectUser = (userId: string) => {
    setSearchText("");
    setShowDropdown(false);
    setSearchResults([]);
    router.push(`/profile/${userId}`);
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <GraduationCap className="h-7 w-7 text-indigo-600" />
            <span className="text-xl font-bold text-gray-800">
              VIIT <span className="text-indigo-600">Alumni</span>
            </span>
          </Link>

          {/* Search Bar - only when logged in */}
          {isLoggedIn && (
            <div className="relative hidden md:block w-1/3">
              <div className="flex items-center border rounded-md px-3 py-2 bg-gray-50">
                <Search className="h-4 w-4 text-gray-400 mr-2" />
                <input
                  type="text"
                  value={searchText}
                  onChange={handleSearchChange}
                  placeholder="Search users by name"
                  className="w-full bg-transparent outline-none text-sm"
                />
              </div>
              {showDropdown && searchResults.length > 0 && (
                <ul className="absolute mt-1 w-full bg-white shadow-lg rounded-md z-50 max-h-60 overflow-auto">
                  {searchResults.map((user) => (
                    <li
                      key={user.id}
                      onClick={() => handleSelectUser(user.id)}
                      className="px-4 py-2 hover:bg-indigo-50 cursor-pointer text-sm"
                    >
                      {user.fullName} ({user.email})
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {isLoggedIn ? (
              <>
                {isAdmin ? (
                  <>
                    {/* admin-specific links go here */}
                  </>
                ) : (
                  <>
                    <Link
                      href="/dashboard"
                      className="px-3 py-2 text-gray-700 hover:text-indigo-600 rounded-md text-sm font-medium flex items-center"
                    >
                      <LayoutDashboard className="h-4 w-4 mr-1" />
                      Dashboard
                    </Link>
                    <Link
                      href="/activity"
                      className="px-3 py-2 text-gray-700 hover:text-indigo-600 rounded-md text-sm font-medium flex items-center"
                    >
                      <Activity className="h-4 w-4 mr-1" />
                      Activity
                    </Link>
                    <Link
                      href="/communities"
                      className="px-3 py-2 text-gray-700 hover:text-indigo-600 rounded-md text-sm font-medium flex items-center"
                    >
                      <Users className="h-4 w-4 mr-1" />
                      Communities
                    </Link>
                    <Link
                      href="/profile"
                      className="px-3 py-2 text-gray-700 hover:text-indigo-600 rounded-md text-sm font-medium flex items-center"
                    >
                      <User className="h-4 w-4 mr-1" />
                      Profile
                    </Link>
                  </>
                )}

                <button
                  onClick={handleLogout}
                  className="ml-3 px-4 py-2 bg-white text-indigo-600 border border-indigo-200 rounded-lg hover:bg-indigo-50 transition-all duration-200 text-sm font-medium flex items-center"
                >
                  <LogOut className="h-4 w-4 mr-1" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-3 py-2 text-gray-700 hover:text-indigo-600 rounded-md text-sm font-medium"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="ml-3 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all duration-200 shadow-sm hover:shadow-md text-sm font-medium"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="p-2 rounded-md text-gray-700 hover:text-indigo-600 focus:outline-none"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-3 py-3 border-t border-gray-100 animate-fadeIn">
            <div className="flex flex-col space-y-2">
              {isLoggedIn ? (
                <>
                  {isAdmin ? (
                    <>
                      {/* admin-specific mobile links */}
                    </>
                  ) : (
                    <>
                      <Link
                        href="/dashboard"
                        className="px-3 py-2 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-md text-sm font-medium"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Dashboard
                      </Link>
                      <Link
                        href="/activity"
                        className="px-3 py-2 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-md text-sm font-medium"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Activity
                      </Link>
                      <Link
                        href="/communities"
                        className="px-3 py-2 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-md text-sm font-medium"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Communities
                      </Link>
                      <Link
                        href="/profile"
                        className="px-3 py-2 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-md text-sm font-medium"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Profile
                      </Link>
                    </>
                  )}
                  <button
                    onClick={handleLogout}
                    className="ml-3 px-4 py-2 bg-white text-indigo-600 border border-indigo-200 rounded-lg hover:bg-indigo-50 transition-all duration-200 text-sm font-medium flex items-center w-full justify-center"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="px-3 py-2 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-md text-sm font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    href="/signup"
                    className="ml-3 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all duration-200 shadow-sm hover:shadow-md text-sm font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
