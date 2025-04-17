"use client";

import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BookOpenIcon, UserCircleIcon, Bars3Icon, XMarkIcon } from "@heroicons/react/24/solid";
import { User } from "@supabase/supabase-js";

export default function HeaderNav() {
  const [user, setUser] = useState<User | null>(null);
  const [profileFullName, setProfileFullName] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getSession();
      setUser(data?.session?.user || null);
    };
    getUser();
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user || null);
      }
    );
    return () => authListener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    async function fetchUserProfile() {
      if (!user) return;
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData?.session?.access_token;
      if (!token) return;
      try {
        const res = await fetch("/api/user_profile", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (!data.error && data.full_name) {
          setProfileFullName(data.full_name);
        }
      } catch (err) {
        console.error("Error fetching user profile:", err);
      }
    }
    fetchUserProfile();
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setDropdownOpen(false);
    router.push("/login");
  };

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2 hover:bg-blue-100 font-bold relative group">
            <BookOpenIcon className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold">
              <span className="text-white bg-teal-500 px-1 rounded">IELTS</span>
              <span className="text-black">Exam.ai</span>
            </span>
          </Link>
        </div>

        {/* Center Navigation Links */}
        <div className="hidden md:flex items-center gap-8">
          <Link 
            href="/ielts-exam-tips" 
            className="text-gray-700 hover:text-blue-600 transition-all duration-200 px-3 py-2 rounded-md hover:bg-blue-50 font-bold relative group"
          >
            IELTS Exam Tips
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-200 group-hover:w-full"></span>
          </Link>
          <Link 
            href="/ielts-mock-tests" 
            className="text-gray-700 hover:text-blue-600 transition-all duration-200 px-3 py-2 rounded-md hover:bg-blue-50 font-bold relative group"
          >
            IELTS Mock Tests
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-200 group-hover:w-full"></span>
          </Link>
        </div>

        {/* Desktop Nav & Auth Buttons */}
        <div className="hidden md:flex items-center gap-6">
          {user ? (
            <div className="relative flex items-center gap-2" ref={dropdownRef}>
              <span className="text-black font-medium">{profileFullName}</span>
              <button onClick={() => setDropdownOpen(!dropdownOpen)} className="flex items-center gap-2">
                <UserCircleIcon className="h-8 w-8 text-gray-600 cursor-pointer" />
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-md z-50">
                  <Link href="/my-profile" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                    My Profile
                  </Link>
                  <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100">
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                href="/login"
                className="px-4 py-2 border border-blue-500 text-blue-500 rounded-md hover:bg-blue-500 hover:text-white transition"
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden">
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? (
              <XMarkIcon className="w-7 h-7 text-gray-800" />
            ) : (
              <Bars3Icon className="w-7 h-7 text-gray-800" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden px-6 pb-4">
          {user ? (
            <div className="flex flex-col gap-2">
              <span className="text-black font-medium">{profileFullName}</span>
              <Link href="/my-profile" className="text-gray-700 hover:text-blue-600">
                My Profile
              </Link>
              <button onClick={handleLogout} className="text-red-600 hover:underline text-left">
                Logout
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <Link
                href="/login"
                className="px-4 py-2 border border-blue-500 text-blue-500 rounded-md hover:bg-blue-500 hover:text-white transition"
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
              >
                Sign Up
              </Link>
            </div>
          )}
          
          {/* Mobile Navigation Links */}
          <div className="mt-4 flex flex-col gap-3">
            <Link 
              href="/ielts-exam-tips" 
              className="text-gray-700 hover:text-blue-600 transition-all duration-200 px-3 py-2 rounded-md hover:bg-blue-50 font-bold"
            >
              IELTS Exam Tips
            </Link>
            <Link 
              href="/ielts-mock-tests" 
              className="text-gray-700 hover:text-blue-600 transition-all duration-200 px-3 py-2 rounded-md hover:bg-blue-50 font-bold"
            >
              IELTS Mock Tests
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
