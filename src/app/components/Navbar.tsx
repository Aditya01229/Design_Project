"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GraduationCap, Menu, X, User, LayoutDashboard, Users, Activity, LogOut } from 'lucide-react';

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkLoginStatus = () => {
      const token = localStorage.getItem("token");
      setIsLoggedIn(!!token);
    };

    checkLoginStatus();
    window.addEventListener("storage", checkLoginStatus);

    return () => {
      window.removeEventListener("storage", checkLoginStatus);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    router.push("/");
    setMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
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

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {isLoggedIn ? (
              <>
                <Link href="/dashboard" className="px-3 py-2 text-gray-700 hover:text-indigo-600 rounded-md text-sm font-medium transition-colors duration-150 flex items-center">
                  <LayoutDashboard className="h-4 w-4 mr-1" />
                  Dashboard
                </Link>
                <Link href="/activity" className="px-3 py-2 text-gray-700 hover:text-indigo-600 rounded-md text-sm font-medium transition-colors duration-150 flex items-center">
                  <Activity className="h-4 w-4 mr-1" />
                  Activity
                </Link>
                <Link href="/communities" className="px-3 py-2 text-gray-700 hover:text-indigo-600 rounded-md text-sm font-medium transition-colors duration-150 flex items-center">
                  <Users className="h-4 w-4 mr-1" />
                  Communities
                </Link>
                <Link href="/profile" className="px-3 py-2 text-gray-700 hover:text-indigo-600 rounded-md text-sm font-medium transition-colors duration-150 flex items-center">
                  <User className="h-4 w-4 mr-1" />
                  Profile
                </Link>

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
                <Link href="/login" className="px-3 py-2 text-gray-700 hover:text-indigo-600 rounded-md text-sm font-medium transition-colors duration-150">
                  Login
                </Link>
                <Link href="/signup" className="ml-3 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all duration-200 shadow-sm hover:shadow-md text-sm font-medium">
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
                  <Link 
                    href="/dashboard" 
                    className="px-3 py-2 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-md text-sm font-medium flex items-center"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <LayoutDashboard className="h-4 w-4 mr-2" />
                    Dashboard
                  </Link>
                  <Link 
                    href="/activity" 
                    className="px-3 py-2 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-md text-sm font-medium flex items-center"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Activity className="h-4 w-4 mr-2" />
                    Recent Alumni Activity
                  </Link>
                  <Link 
                    href="/communities" 
                    className="px-3 py-2 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-md text-sm font-medium flex items-center"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Users className="h-4 w-4 mr-2" />
                    Communities
                  </Link>
                  <Link 
                    href="/profile" 
                    className="px-3 py-2 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-md text-sm font-medium flex items-center"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <User className="h-4 w-4 mr-2" />
                    Profile
                  </Link>
                  <button 
                    onClick={handleLogout} 
                    className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-md text-sm font-medium flex items-center"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
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
                    className="px-3 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium"
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
