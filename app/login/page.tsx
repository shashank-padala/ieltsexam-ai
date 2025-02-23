"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMessage(error.message);
    } else {
      setMessage("Login successful! Redirecting...");
      setTimeout(() => router.push("/"), 2000); // Redirect to home after login
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white border border-gray-200 rounded shadow p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Login</h1>

        {message && <p className="text-red-600 mb-4">{message}</p>}

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="p-2 border border-gray-300 rounded text-gray-800
                       focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="p-2 border border-gray-300 rounded text-gray-800
                       focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors"
          />
          <button
            type="submit"
            disabled={loading}
            className="p-2 bg-blue-600 text-white rounded hover:bg-blue-700
                       focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="mt-4 text-gray-700">
          Don’t have an account?{" "}
          <Link href="/signup" className="text-blue-600 hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
