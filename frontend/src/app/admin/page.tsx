"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Users,
  FolderOpen,
  MessageSquare,
  TrendingUp,
  ArrowUpRight,
  Clock,
  CheckCircle,
  Loader2,
  Bell,
  LogOut,
  Building2,
  Quote,
  ImageIcon,
  Megaphone,
} from "lucide-react";

import { supabase } from "@/lib/supabase";
import { API_BASE_URL } from '@/lib/api';

interface RequirementStats {
  total: number;
  pending: number;
  contacted: number;
  booked: number;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [requirementStats, setRequirementStats] = useState<RequirementStats>({
    total: 0,
    pending: 0,
    contacted: 0,
    booked: 0,
  });
  const [recentRequests, setRecentRequests] = useState<any[]>([]);
  const [loadingStats, setLoadingStats] = useState(true);
  const [artistCount, setArtistCount] = useState(0);
  const [categoryCount, setCategoryCount] = useState(0);
  const [recentArtists, setRecentArtists] = useState<any[]>([]);
  const [adminUsername, setAdminUsername] = useState("");

  useEffect(() => {
    // Check authentication
    const checkAuth = async () => {
      const isLoggedIn = sessionStorage.getItem("adminLoggedIn");
      const accessToken = sessionStorage.getItem("adminAccessToken");

      if (isLoggedIn !== "true" || !accessToken) {
        router.push("/admin/login");
        return;
      }

      // Verify token with backend
      try {
        const response = await fetch(`${API_BASE_URL}/api/admin/verify`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            access_token: accessToken,
          }),
        });

        const data = await response.json();

        if (!data.success) {
          // Session invalid, redirect to login
          sessionStorage.clear();
          router.push("/admin/login");
          return;
        }

        setAdminUsername(sessionStorage.getItem("adminUsername") || "Admin");
      } catch (error) {
        console.error("Auth verification failed:", error);
        sessionStorage.clear();
        router.push("/admin/login");
        return;
      }
    };
    checkAuth();

    const fetchStats = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/requirements`);
        const result = await response.json();
        // Handle both paginated and non-paginated responses
        const data = result.data || result;

        const stats = {
          total: data.length,
          pending: data.filter((r: any) => r.status === "pending").length,
          contacted: data.filter((r: any) => r.status === "contacted").length,
          booked: data.filter((r: any) => r.status === "booked").length,
        };

        setRequirementStats(stats);
        setRecentRequests(data.slice(0, 5));
      } catch (error) {
        console.error("Failed to fetch requirements:", error);
      } finally {
        setLoadingStats(false);
      }
    };

    const fetchArtists = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/performers?limit=100`);
        const result = await response.json();
        // Handle paginated response - data is in result.data
        const data = result.data || result;
        setArtistCount(result.total || data.length);
        setRecentArtists(data.slice(0, 5));
      } catch (error) {
        console.error("Failed to fetch artists:", error);
        setArtistCount(0);
        setRecentArtists([]);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/categories`);
        const result = await response.json();
        // Handle both paginated and non-paginated responses
        const data = result.data || result;
        setCategoryCount(data.length);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
        setCategoryCount(0);
      }
    };

    fetchStats();
    fetchArtists();
    fetchCategories();
  }, [router]);

  const handleLogout = async () => {
    const accessToken = sessionStorage.getItem("adminAccessToken");

    try {
      // Call backend logout endpoint
      await fetch(`${API_BASE_URL}/api/admin/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          access_token: accessToken,
        }),
      });
    } catch (error) {
      console.error("Logout error:", error);
    }

    // Clear all session data
    sessionStorage.clear();
    router.push("/admin/login");
  };

  const stats = [
    {
      icon: <Users className="w-6 h-6" />,
      label: "Total Artists",
      value: artistCount.toString(),
      color: "from-purple-500/20 to-pink-500/20",
      iconColor: "text-purple-400",
    },
    {
      icon: <FolderOpen className="w-6 h-6" />,
      label: "Categories",
      value: categoryCount.toString(), // Dynamic count
      color: "from-blue-500/20 to-cyan-500/20",
      iconColor: "text-blue-400",
    },
    {
      icon: <Clock className="w-6 h-6" />,
      label: "Pending Inquiries",
      value: loadingStats ? "..." : requirementStats.pending.toString(),
      color: "from-yellow-500/20 to-orange-500/20",
      iconColor: "text-yellow-400",
      highlight: requirementStats.pending > 0,
    },
    {
      icon: <CheckCircle className="w-6 h-6" />,
      label: "Booked This Month",
      value: loadingStats ? "..." : requirementStats.booked.toString(),
      color: "from-green-500/20 to-emerald-500/20",
      iconColor: "text-green-400",
    },
  ];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-[#0a0a0b]">
      {/* Header */}
      <header className="bg-[#1a1a1a] border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
              <p className="text-sm text-gray-500">
                Welcome back, {adminUsername}
              </p>
            </div>
            <div className="flex items-center gap-4">
              {requirementStats.pending > 0 && (
                <Link
                  href="/admin/inquiries"
                  className="flex items-center gap-2 px-4 py-2 bg-yellow-500/10 border border-yellow-500/30 rounded-lg text-yellow-400 hover:bg-yellow-500/20 transition-colors"
                >
                  <Bell className="w-4 h-4" />
                  <span>{requirementStats.pending} new</span>
                </Link>
              )}
              <Link
                href="/"
                className="text-orange-400 hover:text-orange-300 font-medium"
              >
                View Site →
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 hover:bg-red-500/20 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid - More Compact */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className={`bg-[#1a1a1a] rounded-xl border ${stat.highlight ? "border-yellow-500/50 animate-pulse" : "border-gray-800"} p-4 transition-all hover:border-gray-700`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className={`p-2 rounded-lg bg-gradient-to-br ${stat.color} ${stat.iconColor}`}>
                  {stat.icon}
                </div>
                <span className="text-2xl font-bold text-white">{stat.value}</span>
              </div>
              <p className="text-sm text-gray-500">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Primary Action - Manage Artists (Hero Card) */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-[#1a1a1a] via-[#1a1a1a] to-[#222] rounded-2xl border border-gray-800 p-8 relative overflow-hidden group hover:border-orange-500/30 transition-all">
            <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />

            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-500/10 border border-orange-500/20 rounded-full text-orange-400 text-xs font-medium mb-3">
                  <Users className="w-3.5 h-3.5" />
                  Core Management
                </div>
                <h2 className="text-3xl font-bold text-white mb-2">Manage Artists</h2>
                <p className="text-gray-400 max-w-xl">
                  Add new performers, update profiles, manage verification status, and organize artist categories from one central hub.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Link
                  href="/admin/artists?action=add"
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-pink-600 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-orange-500/20 transition-all border border-orange-400/20"
                >
                  <Users className="w-5 h-5" />
                  Add New Artist
                </Link>
                <Link
                  href="/admin/artists"
                  className="flex items-center gap-2 px-6 py-3 bg-[#2a2a2a] text-white font-semibold rounded-xl hover:bg-[#333] transition-colors border border-gray-700"
                >
                  View All Artists
                  <ArrowUpRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Secondary Actions Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          <Link
            href="/admin/inquiries"
            className="bg-[#1a1a1a] rounded-xl border border-gray-800 p-4 hover:border-gray-700 hover:bg-[#222] transition-all group relative overflow-hidden"
          >
            {requirementStats.pending > 0 && (
              <div className="absolute top-2 right-2 w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
            )}
            <ArrowUpRight className="absolute top-3 right-3 w-4 h-4 text-gray-600 group-hover:text-orange-500 transition-colors" />
            <div className="w-10 h-10 bg-yellow-500/10 text-yellow-400 rounded-lg flex items-center justify-center mb-3 group-hover:bg-yellow-500/20 transition-colors">
              <MessageSquare className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-white mb-1">Inquiries</h3>
            <p className="text-xs text-gray-500">{requirementStats.total} Total</p>
          </Link>

          <Link
            href="/admin/categories"
            className="bg-[#1a1a1a] rounded-xl border border-gray-800 p-4 hover:border-gray-700 hover:bg-[#222] transition-all group relative"
          >
            <ArrowUpRight className="absolute top-3 right-3 w-4 h-4 text-gray-600 group-hover:text-orange-500 transition-colors" />
            <div className="w-10 h-10 bg-blue-500/10 text-blue-400 rounded-lg flex items-center justify-center mb-3 group-hover:bg-blue-500/20 transition-colors">
              <FolderOpen className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-white mb-1">Categories</h3>
            <p className="text-xs text-gray-500">{categoryCount} Categories</p>
          </Link>

          <Link
            href="/admin/blogs"
            className="bg-[#1a1a1a] rounded-xl border border-gray-800 p-4 hover:border-gray-700 hover:bg-[#222] transition-all group relative"
          >
            <ArrowUpRight className="absolute top-3 right-3 w-4 h-4 text-gray-600 group-hover:text-orange-500 transition-colors" />
            <div className="w-10 h-10 bg-purple-500/10 text-purple-400 rounded-lg flex items-center justify-center mb-3 group-hover:bg-purple-500/20 transition-colors">
              <MessageSquare className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-white mb-1">Blogs</h3>
            <p className="text-xs text-gray-500">Posts & Updates</p>
          </Link>

          <Link
            href="/admin/clients"
            className="bg-[#1a1a1a] rounded-xl border border-gray-800 p-4 hover:border-gray-700 hover:bg-[#222] transition-all group relative"
          >
            <ArrowUpRight className="absolute top-3 right-3 w-4 h-4 text-gray-600 group-hover:text-orange-500 transition-colors" />
            <div className="w-10 h-10 bg-green-500/10 text-green-400 rounded-lg flex items-center justify-center mb-3 group-hover:bg-green-500/20 transition-colors">
              <Building2 className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-white mb-1">Our Clients</h3>
            <p className="text-xs text-gray-500">Logos & Brands</p>
          </Link>

          <Link
            href="/admin/testimonials"
            className="bg-[#1a1a1a] rounded-xl border border-gray-800 p-4 hover:border-gray-700 hover:bg-[#222] transition-all group relative"
          >
            <ArrowUpRight className="absolute top-3 right-3 w-4 h-4 text-gray-600 group-hover:text-orange-500 transition-colors" />
            <div className="w-10 h-10 bg-yellow-500/10 text-yellow-400 rounded-lg flex items-center justify-center mb-3 group-hover:bg-yellow-500/20 transition-colors">
              <Quote className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-white mb-1">Artist Reviews</h3>
            <p className="text-xs text-gray-500">Testimonials</p>
          </Link>

          <Link
            href="/admin/portfolio"
            className="bg-[#1a1a1a] rounded-xl border border-gray-800 p-4 hover:border-gray-700 hover:bg-[#222] transition-all group relative"
          >
            <ArrowUpRight className="absolute top-3 right-3 w-4 h-4 text-gray-600 group-hover:text-orange-500 transition-colors" />
            <div className="w-10 h-10 bg-orange-500/10 text-orange-400 rounded-lg flex items-center justify-center mb-3 group-hover:bg-orange-500/20 transition-colors">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-white mb-1">Portfolio</h3>
            <p className="text-xs text-gray-500">Images &amp; Videos</p>
          </Link>

          <Link
            href="/admin/hero-images"
            className="bg-[#1a1a1a] rounded-xl border border-gray-800 p-4 hover:border-gray-700 hover:bg-[#222] transition-all group relative"
          >
            <ArrowUpRight className="absolute top-3 right-3 w-4 h-4 text-gray-600 group-hover:text-orange-500 transition-colors" />
            <div className="w-10 h-10 bg-pink-500/10 text-pink-400 rounded-lg flex items-center justify-center mb-3 group-hover:bg-pink-500/20 transition-colors">
              <ImageIcon className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-white mb-1">Hero Images</h3>
            <p className="text-xs text-gray-500">Homepage Carousel</p>
          </Link>

          <Link
            href="/admin/event-banners"
            className="bg-[#1a1a1a] rounded-xl border border-gray-800 p-4 hover:border-gray-700 hover:bg-[#222] transition-all group relative"
          >
            <ArrowUpRight className="absolute top-3 right-3 w-4 h-4 text-gray-600 group-hover:text-orange-500 transition-colors" />
            <div className="w-10 h-10 bg-cyan-500/10 text-cyan-400 rounded-lg flex items-center justify-center mb-3 group-hover:bg-cyan-500/20 transition-colors">
              <Megaphone className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-white mb-1">Event Banners</h3>
            <p className="text-xs text-gray-500">Homepage Carousel</p>
          </Link>

          <Link
            href="/admin/about"
            className="bg-[#1a1a1a] rounded-xl border border-gray-800 p-4 hover:border-gray-700 hover:bg-[#222] transition-all group relative"
          >
            <ArrowUpRight className="absolute top-3 right-3 w-4 h-4 text-gray-600 group-hover:text-orange-500 transition-colors" />
            <div className="w-10 h-10 bg-orange-500/10 text-orange-400 rounded-lg flex items-center justify-center mb-3 group-hover:bg-orange-500/20 transition-colors">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-white mb-1">About Us</h3>
            <p className="text-xs text-gray-500">Founder & Team</p>
          </Link>
        </div>        

        {/* Recent Artists */}
        <div className="bg-[#1a1a1a] rounded-xl border border-gray-800 overflow-hidden mb-8">
          <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-orange-400" />
              Recent Artists
            </h2>
            <Link
              href="/admin/artists"
              className="text-orange-400 hover:text-orange-300 text-sm font-medium"
            >
              View All
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#0f0f10]">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Artist
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>

                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {recentArtists.map((artist) => {
                  return (
                    <tr key={artist.id} className="hover:bg-[#2a2a2a]">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Image
                            src={artist.profile_image_url || artist.image_url}
                            alt={artist.name}
                            width={40}
                            height={40}
                            sizes="40px"
                            className="w-10 h-10 rounded-full object-cover"
                          />
                          <div className="ml-4">
                            <div className="text-sm font-medium text-white">
                              {artist.name}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                        {artist.category}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs font-medium bg-green-500/20 text-green-400 rounded-full">
                          Active
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <Link
                          href="/admin/artists"
                          className="text-orange-400 hover:text-orange-300 font-medium"
                        >
                          Manage
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Inquiries */}
        <div className="bg-[#1a1a1a] rounded-xl border border-gray-800 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-orange-400" />
              Recent Inquiries
            </h2>
            <Link
              href="/admin/inquiries"
              className="text-orange-400 hover:text-orange-300 text-sm font-medium"
            >
              View All
            </Link>
          </div>
          {loadingStats ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 text-orange-500 animate-spin" />
            </div>
          ) : recentRequests.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <MessageSquare className="w-10 h-10 mx-auto mb-3 opacity-50" />
              <p>No booking requests yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#0f0f10]">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Event
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Artist Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {recentRequests.map((req) => (
                    <tr
                      key={req.id}
                      className="hover:bg-[#2a2a2a] cursor-pointer"
                      onClick={() =>
                        (window.location.href = "/admin/inquiries")
                      }
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-white">
                          {req.customer_name}
                        </div>
                        <div className="text-xs text-gray-500">
                          {req.customer_email}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                        {req.event_type}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400 capitalize">
                        {req.artist_type}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                        {formatDate(req.event_date)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${req.status === "pending"
                            ? "bg-yellow-500/20 text-yellow-400"
                            : req.status === "contacted"
                              ? "bg-blue-500/20 text-blue-400"
                              : req.status === "booked"
                                ? "bg-green-500/20 text-green-400"
                                : "bg-gray-700 text-gray-400"
                            }`}
                        >
                          {req.status.charAt(0).toUpperCase() +
                            req.status.slice(1)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
