'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Users, Calendar, FolderOpen, MessageSquare, TrendingUp, ArrowUpRight, Clock, CheckCircle, Loader2, Bell } from 'lucide-react';
import { mockArtists, mockCategories } from '@/lib/mockData';

interface RequirementStats {
    total: number;
    pending: number;
    contacted: number;
    booked: number;
}

export default function AdminDashboard() {
    const [requirementStats, setRequirementStats] = useState<RequirementStats>({ total: 0, pending: 0, contacted: 0, booked: 0 });
    const [recentRequests, setRecentRequests] = useState<any[]>([]);
    const [loadingStats, setLoadingStats] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await fetch('http://localhost:8001/api/requirements');
                const data = await response.json();

                const stats = {
                    total: data.length,
                    pending: data.filter((r: any) => r.status === 'pending').length,
                    contacted: data.filter((r: any) => r.status === 'contacted').length,
                    booked: data.filter((r: any) => r.status === 'booked').length,
                };

                setRequirementStats(stats);
                setRecentRequests(data.slice(0, 5));
            } catch (error) {
                console.error('Failed to fetch requirements:', error);
            } finally {
                setLoadingStats(false);
            }
        };

        fetchStats();
    }, []);

    const stats = [
        { icon: <Users className="w-6 h-6" />, label: 'Total Artists', value: mockArtists.length.toString(), color: 'from-purple-500/20 to-pink-500/20', iconColor: 'text-purple-400' },
        { icon: <FolderOpen className="w-6 h-6" />, label: 'Categories', value: mockCategories.length.toString(), color: 'from-blue-500/20 to-cyan-500/20', iconColor: 'text-blue-400' },
        { icon: <Clock className="w-6 h-6" />, label: 'Pending Inquiries', value: loadingStats ? '...' : requirementStats.pending.toString(), color: 'from-yellow-500/20 to-orange-500/20', iconColor: 'text-yellow-400', highlight: requirementStats.pending > 0 },
        { icon: <CheckCircle className="w-6 h-6" />, label: 'Booked This Month', value: loadingStats ? '...' : requirementStats.booked.toString(), color: 'from-green-500/20 to-emerald-500/20', iconColor: 'text-green-400' },
    ];

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
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
                            <p className="text-sm text-gray-500">Manage your artists and bookings</p>
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
                            <Link href="/" className="text-orange-400 hover:text-orange-300 font-medium">
                                View Site →
                            </Link>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {stats.map((stat, index) => (
                        <div
                            key={index}
                            className={`bg-[#1a1a1a] rounded-xl border ${stat.highlight ? 'border-yellow-500/50 animate-pulse' : 'border-gray-800'} p-6 transition-all hover:border-gray-700`}
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} ${stat.iconColor} flex items-center justify-center`}>
                                    {stat.icon}
                                </div>
                                <TrendingUp className="w-5 h-5 text-green-400" />
                            </div>
                            <p className="text-3xl font-bold text-white mb-1">{stat.value}</p>
                            <p className="text-gray-500">{stat.label}</p>
                        </div>
                    ))}
                </div>

                {/* Quick Actions */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    <Link
                        href="/admin/artists"
                        className="bg-[#1a1a1a] rounded-xl border border-gray-800 p-6 hover:border-gray-700 transition-colors group"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-orange-500/20 to-pink-600/20 text-orange-400 rounded-xl flex items-center justify-center">
                                <Users className="w-6 h-6" />
                            </div>
                            <ArrowUpRight className="w-5 h-5 text-gray-600 group-hover:text-orange-400 transition-colors" />
                        </div>
                        <h3 className="text-lg font-semibold text-white mb-1">Manage Artists</h3>
                        <p className="text-gray-500">Add, edit, or remove artists from the platform</p>
                    </Link>

                    <Link
                        href="/admin/categories"
                        className="bg-[#1a1a1a] rounded-xl border border-gray-800 p-6 hover:border-gray-700 transition-colors group"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-cyan-600/20 text-blue-400 rounded-xl flex items-center justify-center">
                                <FolderOpen className="w-6 h-6" />
                            </div>
                            <ArrowUpRight className="w-5 h-5 text-gray-600 group-hover:text-blue-400 transition-colors" />
                        </div>
                        <h3 className="text-lg font-semibold text-white mb-1">Manage Categories</h3>
                        <p className="text-gray-500">Organize artist categories and subcategories</p>
                    </Link>

                    <Link
                        href="/admin/inquiries"
                        className="bg-[#1a1a1a] rounded-xl border border-gray-800 p-6 hover:border-gray-700 transition-colors group relative"
                    >
                        {requirementStats.pending > 0 && (
                            <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-xs font-bold text-black animate-bounce">
                                {requirementStats.pending}
                            </div>
                        )}
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-yellow-500/20 to-orange-600/20 text-yellow-400 rounded-xl flex items-center justify-center">
                                <MessageSquare className="w-6 h-6" />
                            </div>
                            <ArrowUpRight className="w-5 h-5 text-gray-600 group-hover:text-yellow-400 transition-colors" />
                        </div>
                        <h3 className="text-lg font-semibold text-white mb-1">View Inquiries</h3>
                        <p className="text-gray-500">Review and respond to booking requests</p>
                    </Link>
                </div>

                {/* Recent Inquiries */}
                <div className="bg-[#1a1a1a] rounded-xl border border-gray-800 overflow-hidden mb-8">
                    <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                            <MessageSquare className="w-5 h-5 text-orange-400" />
                            Recent Inquiries
                        </h2>
                        <Link href="/admin/inquiries" className="text-orange-400 hover:text-orange-300 text-sm font-medium">
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
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Artist Type</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-800">
                                    {recentRequests.map((req) => (
                                        <tr key={req.id} className="hover:bg-[#2a2a2a] cursor-pointer" onClick={() => window.location.href = '/admin/inquiries'}>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-white">{req.customer_name}</div>
                                                <div className="text-xs text-gray-500">{req.customer_email}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{req.event_type}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400 capitalize">{req.artist_type}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{formatDate(req.event_date)}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${req.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                                                        req.status === 'contacted' ? 'bg-blue-500/20 text-blue-400' :
                                                            req.status === 'booked' ? 'bg-green-500/20 text-green-400' :
                                                                'bg-gray-700 text-gray-400'
                                                    }`}>
                                                    {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Recent Artists */}
                <div className="bg-[#1a1a1a] rounded-xl border border-gray-800 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-white">Recent Artists</h2>
                        <Link href="/admin/artists" className="text-orange-400 hover:text-orange-300 text-sm font-medium">
                            View All
                        </Link>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-[#0f0f10]">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Artist</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-800">
                                {mockArtists.slice(0, 5).map((artist) => {
                                    const category = mockCategories.find((c) => c.id === artist.category_id);
                                    return (
                                        <tr key={artist.id} className="hover:bg-[#2a2a2a]">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <img src={artist.image_url} alt={artist.name} className="w-10 h-10 rounded-full object-cover" />
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-white">{artist.name}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{category?.name}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{artist.location}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {artist.is_verified ? (
                                                    <span className="px-2 py-1 text-xs font-medium bg-green-500/20 text-green-400 rounded-full">Verified</span>
                                                ) : (
                                                    <span className="px-2 py-1 text-xs font-medium bg-gray-700 text-gray-400 rounded-full">Pending</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                <button className="text-orange-400 hover:text-orange-300 font-medium">Edit</button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
}
