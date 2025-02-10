"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const { data, error } = await supabase.auth.signUp({ email, password });

    if (error) {
      setMessage(error.message);
    } else {
      setMessage("Signup successful! Check your email for verification.");
      setTimeout(() => router.push("/login"), 2000); // Redirect to login after 2 sec
    }

    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-4">Sign Up</h1>
      <form onSubmit={handleSignup} className="flex flex-col gap-3 w-80">
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required className="p-2 border rounded"/>
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required className="p-2 border rounded"/>
        <button type="submit" disabled={loading} className="p-2 bg-green-500 text-white rounded">
          {loading ? "Signing up..." : "Sign Up"}
        </button>
      </form>
      {message && <p className="text-red-500 mt-3">{message}</p>}
      <p className="mt-4 text-gray-600">
        Already have an account? <Link href="/login" className="text-blue-500">Login</Link>
      </p>
    </div>
  );
}
