"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Lock, Loader2, User } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Check if already logged in
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        router.push("/admin");
      }
    };
    checkSession();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Call backend authentication endpoint
      const response = await fetch("http://localhost:8000/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      const data = await response.json();

      if (data.success && data.session) {
        // Store session info
        sessionStorage.setItem("adminLoggedIn", "true");
        sessionStorage.setItem("adminEmail", email);
        sessionStorage.setItem("adminUsername", email.split('@')[0] || "Admin");
        sessionStorage.setItem("adminAccessToken", data.session.access_token);
        sessionStorage.setItem("adminRefreshToken", data.session.refresh_token);
        router.push("/admin");
      } else {
        setError(data.message || "Invalid email or password");
        setLoading(false);
      }
    } catch (err: any) {
      setError(err.message || "An error occurred during login");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0b] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-pink-600 bg-clip-text text-transparent mb-2">
              Admin Panel
            </h1>
          </Link>
          <p className="text-gray-500">Sign in to manage your platform</p>
        </div>

        {/* Login Card */}
        <div className="bg-[#1a1a1a] rounded-2xl border border-gray-800 p-8 shadow-xl">
          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-orange-500/20 to-pink-600/20 mx-auto mb-6">
            <Lock className="w-8 h-8 text-orange-400" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Email
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-[#0f0f10] border border-gray-800 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-transparent transition-all"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-[#0f0f10] border border-gray-800 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-transparent transition-all"
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-orange-500 to-pink-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-orange-500/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-800">
            <p className="text-center text-sm text-gray-500">
              Use your Supabase admin credentials to sign in
            </p>
          </div>
        </div>

        {/* Back to Site */}
        <div className="text-center mt-6">
          <Link
            href="/"
            className="text-gray-500 hover:text-orange-400 text-sm transition-colors"
          >
            ← Back to website
          </Link>
        </div>
      </div>
    </div>
  );
}
