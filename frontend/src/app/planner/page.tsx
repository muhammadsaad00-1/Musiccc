'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Calculator, Calendar, Clock, DollarSign, Plus, Minus, ArrowRight, CheckCircle, ArrowLeft } from 'lucide-react';
import { mockCategories } from '@/lib/mockData';

interface BudgetItem {
    id: string;
    category: string;
    name: string;
    price: number;
}

const timelineItems = [
    { id: 1, time: '6 months before', tasks: ['Book venue', 'Book headline entertainment', 'Set budget'] },
    { id: 2, time: '3 months before', tasks: ['Book photographer/videographer', 'Book DJ', 'Finalize guest list'] },
    { id: 3, time: '1 month before', tasks: ['Book makeup artist', 'Confirm all bookings', 'Send invitations'] },
    { id: 4, time: '1 week before', tasks: ['Final coordination with artists', 'Prepare playlist/song requests', 'Venue walkthrough'] },
    { id: 5, time: 'Day of event', tasks: ['Artist arrival & setup', 'Sound check', 'Enjoy your event!'] },
];

const defaultBudgetItems: BudgetItem[] = [
    { id: '1', category: 'Entertainment', name: 'Singer/Performer', price: 150000 },
    { id: '2', category: 'Entertainment', name: 'DJ', price: 80000 },
    { id: '3', category: 'Photography', name: 'Photographer', price: 100000 },
    { id: '4', category: 'Photography', name: 'Videographer', price: 120000 },
    { id: '5', category: 'Beauty', name: 'Makeup Artist', price: 50000 },
];

export default function PlannerPage() {
    const [activeTab, setActiveTab] = useState<'budget' | 'timeline'>('budget');
    const [budgetItems, setBudgetItems] = useState<BudgetItem[]>(defaultBudgetItems);
    const [newItem, setNewItem] = useState({ category: '', name: '', price: '' });

    const totalBudget = budgetItems.reduce((sum, item) => sum + item.price, 0);

    const addItem = () => {
        if (newItem.category && newItem.name && newItem.price) {
            setBudgetItems([
                ...budgetItems,
                {
                    id: Date.now().toString(),
                    category: newItem.category,
                    name: newItem.name,
                    price: parseInt(newItem.price),
                },
            ]);
            setNewItem({ category: '', name: '', price: '' });
        }
    };

    const removeItem = (id: string) => {
        setBudgetItems(budgetItems.filter((item) => item.id !== id));
    };

    return (
        <div className="min-h-screen bg-[#0a0a0b]">
            {/* Hero */}
            <section className="relative py-20">
                <div className="absolute inset-0">
                    <div className="absolute top-20 left-10 w-72 h-72 bg-orange-500/10 rounded-full blur-[100px]" />
                    <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-600/10 rounded-full blur-[120px]" />
                </div>
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8 group"
                    >
                        <div className="w-8 h-8 rounded-full bg-[#1a1a1a] border border-gray-700 flex items-center justify-center group-hover:border-orange-500/50 group-hover:bg-orange-500/10 transition-all">
                            <ArrowLeft className="w-4 h-4" />
                        </div>
                        <span className="text-sm font-medium">Back to Home</span>
                    </Link>
                    <div className="text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#1a1a1a] rounded-full text-gray-300 text-sm mb-6 border border-gray-800">
                            <Calculator className="w-4 h-4 text-orange-400" />
                            <span>Event Planning Made Easy</span>
                        </div>
                        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
                            Event
                            <span className="bg-gradient-to-r from-orange-400 via-pink-500 to-orange-400 bg-clip-text text-transparent"> Planner Tool</span>
                        </h1>
                        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                            Plan your event budget and timeline with our easy-to-use planning tools
                        </p>
                    </div>
                </div>
            </section>

            {/* Tabs */}
            <section className="py-8 border-b border-gray-800">
                <div className="max-w-5xl mx-auto px-4">
                    <div className="flex gap-4">
                        <button
                            onClick={() => setActiveTab('budget')}
                            className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all ${activeTab === 'budget'
                                ? 'bg-gradient-to-r from-orange-500 to-pink-600 text-white'
                                : 'bg-[#1a1a1a] text-gray-400 hover:text-white'
                                }`}
                        >
                            <DollarSign className="w-5 h-5" />
                            Budget Calculator
                        </button>
                        <button
                            onClick={() => setActiveTab('timeline')}
                            className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all ${activeTab === 'timeline'
                                ? 'bg-gradient-to-r from-orange-500 to-pink-600 text-white'
                                : 'bg-[#1a1a1a] text-gray-400 hover:text-white'
                                }`}
                        >
                            <Clock className="w-5 h-5" />
                            Timeline Builder
                        </button>
                    </div>
                </div>
            </section>

            {/* Content */}
            <section className="py-12">
                <div className="max-w-5xl mx-auto px-4">
                    {activeTab === 'budget' ? (
                        <div className="space-y-8">
                            {/* Budget Summary */}
                            <div className="bg-gradient-to-br from-[#1a1a1a] to-[#252525] rounded-2xl border border-gray-800 p-8">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-2xl font-bold text-white">Your Entertainment Budget</h2>
                                    <div className="text-right">
                                        <p className="text-sm text-gray-500">Total Estimated</p>
                                        <p className="text-3xl font-bold text-white">PKR {totalBudget.toLocaleString()}</p>
                                    </div>
                                </div>

                                {/* Budget Items */}
                                <div className="space-y-3 mb-6">
                                    {budgetItems.map((item) => (
                                        <div key={item.id} className="flex items-center justify-between p-4 bg-[#0a0a0b] rounded-xl border border-gray-800">
                                            <div>
                                                <p className="text-white font-medium">{item.name}</p>
                                                <p className="text-sm text-gray-500">{item.category}</p>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <span className="text-white font-semibold">PKR {item.price.toLocaleString()}</span>
                                                <button
                                                    onClick={() => removeItem(item.id)}
                                                    className="p-2 text-gray-500 hover:text-red-400 transition-colors"
                                                >
                                                    <Minus className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Add New Item */}
                                <div className="border-t border-gray-800 pt-6">
                                    <h3 className="text-lg font-semibold text-white mb-4">Add Item</h3>
                                    <div className="grid sm:grid-cols-4 gap-4">
                                        <select
                                            value={newItem.category}
                                            onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                                            className="px-4 py-3 bg-[#0a0a0b] border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                        >
                                            <option value="">Category</option>
                                            {mockCategories.map((cat) => (
                                                <option key={cat.id} value={cat.name}>{cat.name}</option>
                                            ))}
                                        </select>
                                        <input
                                            type="text"
                                            placeholder="Item name"
                                            value={newItem.name}
                                            onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                                            className="px-4 py-3 bg-[#0a0a0b] border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                        />
                                        <input
                                            type="number"
                                            placeholder="Price (PKR)"
                                            value={newItem.price}
                                            onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                                            className="px-4 py-3 bg-[#0a0a0b] border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                        />
                                        <button
                                            onClick={addItem}
                                            className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-pink-600 text-white font-medium rounded-xl hover:shadow-lg hover:shadow-pink-500/30 transition-all"
                                        >
                                            <Plus className="w-5 h-5" />
                                            Add
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* CTA */}
                            <div className="text-center">
                                <p className="text-gray-400 mb-4">Ready to book artists within your budget?</p>
                                <Link
                                    href="/post-requirement"
                                    className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-orange-500 to-pink-600 text-white font-semibold rounded-full hover:shadow-lg hover:shadow-pink-500/30 transition-all"
                                >
                                    Get Quotes from Artists
                                    <ArrowRight className="w-5 h-5" />
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-8">
                            {/* Timeline */}
                            <div className="bg-gradient-to-br from-[#1a1a1a] to-[#252525] rounded-2xl border border-gray-800 p-8">
                                <h2 className="text-2xl font-bold text-white mb-8">Event Planning Timeline</h2>
                                <p className="text-gray-400 mb-8">A suggested timeline for planning your event entertainnment</p>

                                <div className="relative">
                                    {/* Timeline Line */}
                                    <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-orange-500 to-pink-600" />

                                    {/* Timeline Items */}
                                    <div className="space-y-8">
                                        {timelineItems.map((item, index) => (
                                            <div key={item.id} className="relative pl-16">
                                                {/* Dot */}
                                                <div className="absolute left-4 top-0 w-5 h-5 bg-gradient-to-r from-orange-500 to-pink-600 rounded-full border-4 border-[#1a1a1a]" />

                                                {/* Content */}
                                                <div className="bg-[#0a0a0b] rounded-xl border border-gray-800 p-6">
                                                    <h3 className="text-lg font-semibold text-white mb-3">
                                                        <Calendar className="w-4 h-4 inline-block mr-2 text-orange-400" />
                                                        {item.time}
                                                    </h3>
                                                    <ul className="space-y-2">
                                                        {item.tasks.map((task, i) => (
                                                            <li key={i} className="flex items-center gap-2 text-gray-400">
                                                                <CheckCircle className="w-4 h-4 text-green-400" />
                                                                {task}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* CTA */}
                            <div className="text-center">
                                <p className="text-gray-400 mb-4">Ready to start booking?</p>
                                <Link
                                    href="/search"
                                    className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-orange-500 to-pink-600 text-white font-semibold rounded-full hover:shadow-lg hover:shadow-pink-500/30 transition-all"
                                >
                                    Browse Artists
                                    <ArrowRight className="w-5 h-5" />
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
