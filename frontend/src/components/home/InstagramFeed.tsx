'use client';

import { Instagram, Video, Layers, Heart, MessageCircle } from 'lucide-react';
import Link from 'next/link';

// Mock data for the Instagram feed to match the visual style
const IF_POSTS = [
  {
    id: '1',
    imageUrl: 'https://images.unsplash.com/photo-1540039155733-d740236a9972?q=80&w=600&auto=format&fit=crop',
    type: 'video',
    likes: '1.2K',
    comments: '45',
  },
  {
    id: '2',
    imageUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=600&auto=format&fit=crop',
    type: 'carousel',
    likes: '892',
    comments: '23',
  },
  {
    id: '3',
    imageUrl: 'https://images.unsplash.com/photo-1470229722913-7c090be5c520?q=80&w=600&auto=format&fit=crop',
    type: 'image',
    likes: '2.4K',
    comments: '128',
  },
  {
    id: '4',
    imageUrl: 'https://images.unsplash.com/photo-1501281668745-f7f57922c3b1?q=80&w=600&auto=format&fit=crop',
    type: 'carousel',
    likes: '567',
    comments: '12',
  },
  {
    id: '5',
    imageUrl: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80&w=600&auto=format&fit=crop',
    type: 'video',
    likes: '3.1K',
    comments: '210',
  },
  {
    id: '6',
    imageUrl: 'https://images.unsplash.com/photo-1493225457124-a1a2a5f5f4a7?q=80&w=600&auto=format&fit=crop',
    type: 'carousel',
    likes: '943',
    comments: '34',
  },
  {
    id: '7',
    imageUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=600&auto=format&fit=crop',
    type: 'image',
    likes: '1.5K',
    comments: '67',
  },
  {
    id: '8',
    imageUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=600&auto=format&fit=crop',
    type: 'video',
    likes: '4.2K',
    comments: '312',
  },
  {
    id: '9',
    imageUrl: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?q=80&w=600&auto=format&fit=crop',
    type: 'image',
    likes: '782',
    comments: '19',
  },
  {
    id: '10',
    imageUrl: 'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?q=80&w=600&auto=format&fit=crop',
    type: 'carousel',
    likes: '1.8K',
    comments: '89',
  },
  {
    id: '11',
    imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=600&auto=format&fit=crop',
    type: 'video',
    likes: '2.9K',
    comments: '156',
  },
  {
    id: '12',
    imageUrl: 'https://images.unsplash.com/photo-1520623315573-04983050a41d?q=80&w=600&auto=format&fit=crop',
    type: 'image',
    likes: '1.1K',
    comments: '45',
  },
];

export default function InstagramFeed() {
  return (
    <section className="w-full bg-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Instagram Profile Header */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-8 mb-12">
          {/* Profile Picture with Story Ring */}
          <div className="relative">
            <div className="w-24 h-24 md:w-28 md:h-28 rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500 p-1">
              <div className="w-full h-full rounded-full border-2 border-white overflow-hidden bg-white">
                {/* Fallback to a logo or event image for the profile */}
                <img
                  src="/logo.png"
                  alt="The Artist Factory"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback if logo.png doesn't exist
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1493225457124-a1a2a5f5f4a7?q=80&w=150&auto=format&fit=crop';
                  }}
                />
              </div>
            </div>
          </div>

          {/* Profile Details */}
          <div className="flex flex-col items-center md:items-start space-y-4">
            <div className="flex flex-col md:flex-row items-center gap-4">
              <div className="text-center md:text-left">
                <h2 className="text-xl md:text-2xl font-bold text-gray-900 leading-tight">The Artist Factory</h2>
                <p className="text-gray-500 text-sm">@theartistfactoryofficial</p>
              </div>
              
              <Link 
                href="https://www.instagram.com/theartistfactoryofficial" 
                target="_blank"
                rel="noopener noreferrer"
                className="hidden md:flex items-center gap-2 bg-[#0095f6] hover:bg-[#1877f2] text-white px-6 py-2 rounded-md font-semibold text-sm transition-colors"
              >
                <Instagram size={18} />
                <span>Follow</span>
              </Link>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-6 md:gap-8 text-gray-900">
              <div className="flex flex-col md:flex-row md:gap-1 items-center">
                <span className="font-bold text-lg">336</span>
                <span className="text-gray-600 text-sm">Posts</span>
              </div>
              <div className="flex flex-col md:flex-row md:gap-1 items-center">
                <span className="font-bold text-lg">9.9K</span>
                <span className="text-gray-600 text-sm">Followers</span>
              </div>
              <div className="flex flex-col md:flex-row md:gap-1 items-center">
                <span className="font-bold text-lg">6K</span>
                <span className="text-gray-600 text-sm">Following</span>
              </div>
            </div>

            {/* Mobile Follow Button */}
            <Link 
              href="https://www.instagram.com/theartistfactoryofficial" 
              target="_blank"
              rel="noopener noreferrer"
              className="md:hidden flex items-center justify-center gap-2 bg-[#0095f6] hover:bg-[#1877f2] text-white px-24 py-2 rounded-md font-semibold text-sm transition-colors w-full"
            >
              <Instagram size={18} />
              <span>Follow</span>
            </Link>
          </div>
        </div>

        {/* Instagram Grid */}
        <div className="grid grid-cols-3 md:grid-cols-4 gap-1 md:gap-[4px]">
          {IF_POSTS.map((post) => (
            <Link 
              key={post.id} 
              href="https://www.instagram.com/theartistfactoryofficial"
              target="_blank"
              rel="noopener noreferrer"
              className="relative aspect-square group overflow-hidden bg-gray-100 cursor-pointer block"
            >
              <img
                src={post.imageUrl}
                alt="Instagram post"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
              
              {/* Top Right Icon Indicator */}
              {post.type === 'video' && (
                <div className="absolute top-2 right-2 text-white drop-shadow-md">
                  <Video size={18} className="fill-white" />
                </div>
              )}
              {post.type === 'carousel' && (
                <div className="absolute top-2 right-2 text-white drop-shadow-md">
                  <Layers size={18} className="fill-white" />
                </div>
              )}

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-6">
                <div className="flex items-center gap-2 text-white font-bold">
                  <Heart size={20} className="fill-white" />
                  <span>{post.likes}</span>
                </div>
                <div className="flex items-center gap-2 text-white font-bold">
                  <MessageCircle size={20} className="fill-white" />
                  <span>{post.comments}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
