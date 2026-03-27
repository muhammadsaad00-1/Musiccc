'use client';

import { Instagram } from 'lucide-react';

const posts = [
  {
    id: 1,
    title: 'Live Wedding Moment',
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 2,
    title: 'Corporate Night Setup',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 3,
    title: 'Concert Crowd Energy',
    image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 4,
    title: 'Stage Performance',
    image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 5,
    title: 'Mehendi Night',
    image: 'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 6,
    title: 'Private Party',
    image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=900&q=80',
  },
];

export default function InstagramShowcase() {
  return (
    <section className="py-20 bg-[#0a0a0b] border-t border-gray-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
          <div>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-500/10 border border-pink-500/30 text-pink-400 text-sm font-medium mb-4">
              <Instagram className="w-4 h-4" /> Instagram
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white">From Our Instagram</h2>
            <p className="text-gray-400 mt-2">Follow our latest event moments and artist highlights.</p>
          </div>

          <a
            href="https://www.instagram.com/theartistfactoryofficial"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-pink-600 to-orange-500 text-white font-semibold hover:opacity-90 transition-opacity"
          >
            Visit @theartistfactoryofficial
          </a>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {posts.map((post) => (
            <a
              key={post.id}
              href="https://www.instagram.com/theartistfactoryofficial"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative block overflow-hidden rounded-xl border border-gray-800 hover:border-pink-500/40 transition-all"
            >
              <img src={post.image} alt={post.title} className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/45 transition-colors flex items-end p-2.5">
                <span className="text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity line-clamp-2">{post.title}</span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
