import Link from 'next/link';
import { Mic2, Music, Disc3, Sparkles, Users, Star, Heart, Zap } from 'lucide-react';

// Pakistan-focused artist categories prioritizing music
const categories = [
    { id: 1, name: 'Singers', slug: 'singers', icon: <Mic2 className="w-8 h-8" />, count: 150, hot: true, description: 'Pop, Classical, Bollywood' },
    { id: 2, name: 'Qawwals', slug: 'qawwals', icon: <Music className="w-8 h-8" />, count: 80, hot: true, description: 'Traditional & Modern' },
    { id: 3, name: 'Sufi Artists', slug: 'sufi-artists', icon: <Sparkles className="w-8 h-8" />, count: 45, hot: true, description: 'Soul-stirring performances' },
    { id: 4, name: 'Live Bands', slug: 'live-bands', icon: <Users className="w-8 h-8" />, count: 60, hot: false, description: 'Rock, Fusion, Jazz' },
    { id: 5, name: 'Ghazal Artists', slug: 'ghazal-artists', icon: <Heart className="w-8 h-8" />, count: 35, hot: false, description: 'Poetry in melody' },
    { id: 6, name: 'Folk Singers', slug: 'folk-singers', icon: <Star className="w-8 h-8" />, count: 50, hot: false, description: 'Punjabi, Sindhi, Pashto' },
    { id: 7, name: 'Classical Musicians', slug: 'classical-musicians', icon: <Music className="w-8 h-8" />, count: 40, hot: false, description: 'Tabla, Sitar, Harmonium' },
    { id: 8, name: 'DJs', slug: 'djs', icon: <Disc3 className="w-8 h-8" />, count: 100, hot: false, description: 'EDM, Bollywood, House' },
];

export default function CategoryGrid() {
    return (
        <section className="py-16 lg:py-24 bg-[#0a0a0b]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#1a1a1a] rounded-full text-gray-400 text-sm mb-4 border border-gray-800">
                        <Mic2 className="w-4 h-4 text-orange-400" />
                        <span>Top Categories</span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                        Find Your Perfect
                        <span className="bg-gradient-to-r from-orange-400 to-pink-500 bg-clip-text text-transparent"> Musical Artist</span>
                    </h2>
                    <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                        Book talented singers, qawwals, and musicians for weddings, concerts, and celebrations across Pakistan
                    </p>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
                    {categories.map((category) => (
                        <Link
                            key={category.id}
                            href={`/artists/${category.slug}`}
                            className="group relative bg-[#1a1a1a] rounded-2xl p-6 border border-gray-800 hover:border-orange-500/50 transition-all duration-300 overflow-hidden"
                        >
                            {/* HOT Badge */}
                            {category.hot && (
                                <div className="absolute top-3 right-3 px-2 py-0.5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center gap-1">
                                    <Zap className="w-3 h-3" />
                                    HOT
                                </div>
                            )}

                            {/* Hover Gradient Background */}
                            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-pink-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                            {/* Content */}
                            <div className="relative z-10">
                                {/* Icon */}
                                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500/20 to-pink-600/20 flex items-center justify-center text-orange-400 mb-4 group-hover:from-orange-500 group-hover:to-pink-600 group-hover:text-white transition-all duration-300">
                                    {category.icon}
                                </div>

                                {/* Name */}
                                <h3 className="font-bold text-lg text-white group-hover:text-orange-400 transition-colors mb-1">
                                    {category.name}
                                </h3>

                                {/* Description */}
                                <p className="text-xs text-gray-500 mb-2">
                                    {category.description}
                                </p>

                                {/* Count */}
                                <p className="text-sm text-gray-400">
                                    {category.count}+ Artists
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* View All Link */}
                <div className="text-center mt-10">
                    <Link
                        href="/search"
                        className="inline-flex items-center gap-2 text-orange-400 hover:text-orange-300 font-medium transition-colors"
                    >
                        View All Categories
                        <span className="text-lg">→</span>
                    </Link>
                </div>
            </div>
        </section>
    );
}
