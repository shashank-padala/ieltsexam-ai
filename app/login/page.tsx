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
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-4">Login</h1>
      <form onSubmit={handleLogin} className="flex flex-col gap-3 w-80">
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required className="p-2 border rounded"/>
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required className="p-2 border rounded"/>
        <button type="submit" disabled={loading} className="p-2 bg-blue-500 text-white rounded">
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
      {message && <p className="text-red-500 mt-3">{message}</p>}
      <p className="mt-4 text-gray-600">
        Don’t have an account? <Link href="/signup" className="text-blue-500">Sign Up</Link>
      </p>
    </div>
  );
}
