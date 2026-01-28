import Link from 'next/link';
import { Users, Calendar, FolderOpen, MessageSquare, TrendingUp, ArrowUpRight } from 'lucide-react';
import { mockArtists, mockCategories } from '@/lib/mockData';

const stats = [
    { icon: <Users className="w-6 h-6" />, label: 'Total Artists', value: mockArtists.length.toString() },
    { icon: <FolderOpen className="w-6 h-6" />, label: 'Categories', value: mockCategories.length.toString() },
    { icon: <Calendar className="w-6 h-6" />, label: 'Pending Inquiries', value: '12' },
    { icon: <MessageSquare className="w-6 h-6" />, label: 'This Month', value: '45' },
];

export default function AdminDashboard() {
    return (
        <div className="min-h-screen bg-[#0a0a0b]">
            {/* Header */}
            <header className="bg-[#1a1a1a] border-b border-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
                        <Link href="/" className="text-orange-400 hover:text-orange-300 font-medium">
                            View Site →
                        </Link>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {stats.map((stat, index) => (
                        <div key={index} className="bg-[#1a1a1a] rounded-xl border border-gray-800 p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500/20 to-pink-600/20 text-orange-400 flex items-center justify-center">
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
                            <div className="w-12 h-12 bg-gradient-to-br from-orange-500/20 to-pink-600/20 text-orange-400 rounded-xl flex items-center justify-center">
                                <FolderOpen className="w-6 h-6" />
                            </div>
                            <ArrowUpRight className="w-5 h-5 text-gray-600 group-hover:text-orange-400 transition-colors" />
                        </div>
                        <h3 className="text-lg font-semibold text-white mb-1">Manage Categories</h3>
                        <p className="text-gray-500">Organize artist categories and subcategories</p>
                    </Link>

                    <Link
                        href="/admin/inquiries"
                        className="bg-[#1a1a1a] rounded-xl border border-gray-800 p-6 hover:border-gray-700 transition-colors group"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-orange-500/20 to-pink-600/20 text-orange-400 rounded-xl flex items-center justify-center">
                                <MessageSquare className="w-6 h-6" />
                            </div>
                            <ArrowUpRight className="w-5 h-5 text-gray-600 group-hover:text-orange-400 transition-colors" />
                        </div>
                        <h3 className="text-lg font-semibold text-white mb-1">View Inquiries</h3>
                        <p className="text-gray-500">Review and respond to booking requests</p>
                    </Link>
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
