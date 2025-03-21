// components/HeaderNav.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BookOpenIcon, UserCircleIcon } from "@heroicons/react/24/solid";
import { User } from "@supabase/supabase-js";

export default function HeaderNav() {
  const [user, setUser] = useState<User | null>(null);
  const [profileFullName, setProfileFullName] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Get the auth session and user
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

  // If user exists, fetch the full name from user_profile table
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

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
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
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo and Main Links */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <BookOpenIcon className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-black">IELTSExam.ai</span>
          </Link>
        </div>

        {/* Right Side: User Session Check */}
        <div className="relative">
          {user ? (
            <div className="relative flex items-center gap-2">
              <span className="text-black font-medium">
                {profileFullName}
              </span>
              <div ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2"
                >
                  <UserCircleIcon className="h-8 w-8 text-gray-600 cursor-pointer" />
                </button>
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-md z-50">
                    <Link
                      href="/my-profile"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      My Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex gap-4 items-center">
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
        </div>
      </div>
    </nav>
  );
}
