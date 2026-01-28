import { Category } from '@/types';

// Event Types
export const eventTypes = [
    'Wedding',
    'Corporate Event',
    'Birthday Party',
    'Concert',
    'Private Party',
    'Mehendi',
    'Engagement',
    'Anniversary',
];

// Cities
export const cities = [
    'Lahore',
    'Karachi',
    'Islamabad',
    'Rawalpindi',
    'Faisalabad',
    'Multan',
    'Peshawar',
    'Quetta',
];

// Price ranges
export const priceRanges = [
    { label: 'Under PKR 50,000', value: '0-50000' },
    { label: 'PKR 50,000 - 100,000', value: '50000-100000' },
    { label: 'PKR 100,000 - 300,000', value: '100000-300000' },
    { label: 'PKR 300,000 - 500,000', value: '300000-500000' },
    { label: 'PKR 500,000+', value: '500000+' },
];

// Mock Categories
export const mockCategories: Category[] = [
    { id: 1, name: 'Singers', slug: 'singers', description: 'Professional singers for all types of events', artist_count: 150 },
    { id: 2, name: 'Musicians', slug: 'musicians', description: 'Talented musicians and bands', artist_count: 80 },
    { id: 3, name: 'DJs', slug: 'djs', description: 'Top DJs for parties and events', artist_count: 120 },
    { id: 4, name: 'Dancers', slug: 'dancers', description: 'Classical, contemporary and folk dancers', artist_count: 60 },
    { id: 5, name: 'Comedians', slug: 'comedians', description: 'Stand-up comedians and entertainers', artist_count: 40 },
    { id: 6, name: 'Anchors', slug: 'anchors', description: 'Professional event hosts and MCs', artist_count: 70 },
    { id: 7, name: 'Makeup Artists', slug: 'makeup-artists', description: 'Bridal and event makeup specialists', artist_count: 90 },
    { id: 8, name: 'Photographers', slug: 'photographers', description: 'Wedding and event photographers', artist_count: 110 },
    { id: 9, name: 'Mehndi Artists', slug: 'mehndi-artists', description: 'Traditional and modern mehndi designs', artist_count: 50 },
    { id: 10, name: 'Decorators', slug: 'decorators', description: 'Event decoration and styling', artist_count: 45 },
];

// Mock Artists with rich media data
export const mockArtists = [
    {
        id: 1,
        name: 'Ali Zafar',
        slug: 'ali-zafar',
        category_id: 1,
        image_url: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400',
        cover_image: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=1200',
        bio: `Ali Zafar is a Pakistani singer, songwriter, model, actor, and painter. Born on May 18, 1980, in Lahore, Pakistan, he is one of the most celebrated and influential artists in South Asian entertainment history.

His musical journey began with the release of his debut album "Huqa Pani" in 2003, which became one of the best-selling albums in Pakistani music history. The album featured breakthrough hits like "Channo" and "Rangeen," which established him as a household name across the subcontinent.

Over his two-decade career, Ali Zafar has released multiple chart-topping albums including "Masty" (2006), "Jhoom" (2011), and "Lightingale" (2021). His music seamlessly blends pop, rock, Sufi, and contemporary sounds, creating a unique style that resonates with audiences of all ages.

Beyond music, Ali Zafar has made significant contributions to Pakistani and Bollywood cinema, starring in acclaimed films like "Tere Bin Laden," "Mere Brother Ki Dulhan," "London Paris New York," and "Total Siyapaa." His charismatic screen presence and natural acting talent have earned him numerous film awards and nominations.

He is known for his electrifying live performances that combine powerful vocals, dynamic stage presence, and an ability to connect deeply with audiences. Having performed over 500 live concerts worldwide, Ali Zafar has graced some of the most prestigious stages across the globe, from sold-out stadium shows to intimate private events.

Ali Zafar is also an accomplished painter and has exhibited his artwork internationally. His multifaceted talents and philanthropic work have made him a cultural icon and role model for aspiring artists throughout Pakistan and beyond.`,
        short_bio: 'Chart-topping singer & actor',
        location: 'Lahore',
        price_range: 'PKR 500,000+',
        is_featured: true,
        is_verified: true,
        languages: ['Urdu', 'Punjabi', 'English', 'Hindi'],
        performance_duration: '2-3 hours',
        genres: ['Pop', 'Rock', 'Sufi', 'Bollywood'],
        achievements: ['Lux Style Award Winner', 'Filmfare Award Nominee', '15+ Million Spotify Streams', '500+ Live Performances'],
        gallery_urls: [
            'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400',
            'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=400',
            'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400',
        ],
        albums: [
            { id: 1, name: 'Huqa Pani', year: '2003', cover: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=300', tracks: 12 },
            { id: 2, name: 'Masty', year: '2006', cover: 'https://images.unsplash.com/photo-1598387993441-a364f854c3e1?w=300', tracks: 10 },
            { id: 3, name: 'Jhoom', year: '2011', cover: 'https://images.unsplash.com/photo-1619983081563-430f63602796?w=300', tracks: 8 },
            { id: 4, name: 'Lightingale', year: '2021', cover: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300', tracks: 14 },
        ],
        popularSongs: [
            { id: 1, name: 'Channo', plays: '25M', duration: '4:32' },
            { id: 2, name: 'Chal Dil Mere', plays: '18M', duration: '3:45' },
            { id: 3, name: 'Jhoom', plays: '15M', duration: '5:12' },
            { id: 4, name: 'Rangeen', plays: '12M', duration: '4:08' },
            { id: 5, name: 'Rockstar', plays: '10M', duration: '3:55' },
        ],
        youtubeVideos: [
            { id: 1, title: 'Channo - Official Music Video', videoId: 'dQw4w9WgXcQ', views: '25M', thumbnail: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400' },
            { id: 2, title: 'Live at Royal Palm', videoId: 'dQw4w9WgXcQ', views: '5M', thumbnail: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400' },
            { id: 3, title: 'Unplugged Session - Jhoom', videoId: 'dQw4w9WgXcQ', views: '8M', thumbnail: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=400' },
        ],
        socialLinks: {
            instagram: 'https://instagram.com/ali_zafar',
            youtube: 'https://youtube.com/alizafar',
            spotify: 'https://spotify.com/artist/alizafar',
        },
    },
    {
        id: 2,
        name: 'Atif Aslam',
        slug: 'atif-aslam',
        category_id: 1,
        image_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
        cover_image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=1200',
        bio: `Atif Aslam is one of the most celebrated and iconic voices in South Asian music history. Born on March 12, 1983, in Wazirabad, Pakistan, he has become a defining voice of his generation, known for his distinctive vocal style that combines raw emotion with technical brilliance.

His journey to stardom began with the band "Jal," where he served as the lead vocalist. The debut album "Aadat" (2004) catapulted him to fame, with the title track becoming one of the most played songs in Pakistani music history. The song's success was so immense that it was later recreated in Bollywood, introducing Atif to the Indian music industry.

Over his remarkable career spanning two decades, Atif Aslam has sung over 150 Bollywood songs, making him one of the most prolific playback singers in Indian cinema. His notable Bollywood hits include "Tera Hone Laga Hoon," "Pehli Nazar Mein," "Tu Jaane Na," "Dil Diyan Gallan," "Tere Sang Yaara," and countless others that have become anthem songs for an entire generation.

Beyond playback singing, Atif has released multiple successful solo albums including "Jal Pari" (2004), "Doorie" (2006), and "Meri Kahani" (2012). His work in Coke Studio Pakistan has produced some of the show's most iconic performances, including the legendary "Tajdar-e-Haram" which has garnered over 200 million views on YouTube.

Known for his electrifying live concerts, Atif Aslam has performed over 1,000 shows worldwide, selling out venues from Madison Square Garden to Wembley Arena. His concerts are known for their high energy, emotional depth, and his signature style of connecting with audiences by having them sing along to every word.

Atif has won numerous awards including multiple Lux Style Awards, Filmfare Awards, and IIFA Awards. He is widely regarded as the voice that defined romantic music in South Asia during the 2000s and 2010s, and continues to be one of the most sought-after performers for weddings, corporate events, and concerts across the globe.`,
        short_bio: 'Legendary playback singer',
        location: 'Karachi',
        price_range: 'PKR 800,000+',
        is_featured: true,
        is_verified: true,
        languages: ['Urdu', 'Hindi', 'Punjabi'],
        performance_duration: '2-3 hours',
        genres: ['Pop', 'Romantic', 'Sufi', 'Bollywood'],
        achievements: ['Lux Style Awards', 'Filmfare Award Winner', '50+ Million Spotify Streams', '1000+ Live Performances'],
        gallery_urls: [
            'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400',
            'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400',
        ],
        albums: [
            { id: 1, name: 'Jal Pari', year: '2004', cover: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=300', tracks: 11 },
            { id: 2, name: 'Doorie', year: '2006', cover: 'https://images.unsplash.com/photo-1598387993441-a364f854c3e1?w=300', tracks: 9 },
            { id: 3, name: 'Meri Kahani', year: '2012', cover: 'https://images.unsplash.com/photo-1619983081563-430f63602796?w=300', tracks: 12 },
        ],
        popularSongs: [
            { id: 1, name: 'Tera Hone Laga Hoon', plays: '50M', duration: '4:15' },
            { id: 2, name: 'Pehli Nazar Mein', plays: '45M', duration: '5:02' },
            { id: 3, name: 'Tajdar-e-Haram', plays: '40M', duration: '8:45' },
            { id: 4, name: 'Dil Diyan Gallan', plays: '35M', duration: '4:28' },
            { id: 5, name: 'Tere Sang Yaara', plays: '30M', duration: '4:12' },
        ],
        youtubeVideos: [
            { id: 1, title: 'Tajdar-e-Haram - Coke Studio', videoId: 'dQw4w9WgXcQ', views: '200M', thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400' },
            { id: 2, title: 'Live Concert Karachi', videoId: 'dQw4w9WgXcQ', views: '15M', thumbnail: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400' },
        ],
        socialLinks: {
            instagram: 'https://instagram.com/ataborofficial',
            youtube: 'https://youtube.com/atifaslam',
            spotify: 'https://spotify.com/artist/atifaslam',
        },
    },
    {
        id: 3,
        name: 'DJ Faisal',
        slug: 'dj-faisal',
        category_id: 3,
        image_url: 'https://images.unsplash.com/photo-1571266028243-e4733b0f0bb0?w=400',
        cover_image: 'https://images.unsplash.com/photo-1571266028243-e4733b0f0bb0?w=1200',
        bio: 'Premier DJ known for high-energy sets at weddings and corporate events across Pakistan.',
        short_bio: 'Premier wedding & event DJ',
        location: 'Islamabad',
        price_range: 'PKR 80,000 - 150,000',
        is_featured: true,
        is_verified: true,
        languages: ['English', 'Urdu'],
        performance_duration: '4-6 hours',
        genres: ['EDM', 'Bollywood', 'Hip-Hop', 'House'],
        achievements: ['500+ Events', 'Top Rated DJ Islamabad'],
    },
    {
        id: 4,
        name: 'Sara Khan',
        slug: 'sara-khan',
        category_id: 7,
        image_url: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400',
        bio: 'Award-winning bridal makeup artist with over 10 years of experience in creating stunning looks.',
        short_bio: 'Award-winning bridal makeup artist',
        location: 'Lahore',
        price_range: 'PKR 50,000 - 100,000',
        is_featured: true,
        is_verified: true,
        languages: ['Urdu', 'English'],
        performance_duration: '3-4 hours',
    },
    {
        id: 5,
        name: 'Ahmed Photography',
        slug: 'ahmed-photography',
        category_id: 8,
        image_url: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=400',
        bio: 'Capturing timeless moments with artistic vision and professional expertise.',
        short_bio: 'Professional wedding photographer',
        location: 'Karachi',
        price_range: 'PKR 100,000 - 200,000',
        is_featured: true,
        is_verified: true,
        languages: ['Urdu', 'English'],
        performance_duration: 'Full day coverage',
    },
    {
        id: 6,
        name: 'Mehndi by Fatima',
        slug: 'mehndi-by-fatima',
        category_id: 9,
        image_url: 'https://images.unsplash.com/photo-1596704017254-9b121068fb31?w=400',
        bio: 'Intricate mehndi designs blending traditional patterns with modern artistry.',
        short_bio: 'Expert mehndi artist',
        location: 'Lahore',
        price_range: 'PKR 20,000 - 50,000',
        is_featured: true,
        is_verified: true,
        languages: ['Urdu', 'Punjabi'],
        performance_duration: '2-4 hours',
    },
];

// Event Types with details
export const eventTypeDetails = [
    {
        id: 'wedding',
        name: 'Wedding',
        slug: 'wedding',
        description: 'Make your big day unforgettable with our curated selection of wedding entertainers',
        image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800',
        popularCategories: ['Singers', 'DJs', 'Photographers', 'Makeup Artists', 'Mehndi Artists'],
        priceRange: 'PKR 100,000 - 2,000,000+',
    },
    {
        id: 'corporate',
        name: 'Corporate Event',
        slug: 'corporate',
        description: 'Professional entertainment for corporate gatherings, conferences, and team events',
        image: 'https://images.unsplash.com/photo-1540575467063-178a50c6b2a6?w=800',
        popularCategories: ['Anchors', 'Comedians', 'Musicians', 'DJs'],
        priceRange: 'PKR 50,000 - 500,000+',
    },
    {
        id: 'birthday',
        name: 'Birthday Party',
        slug: 'birthday',
        description: 'Celebrate in style with entertainment perfect for birthday celebrations',
        image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800',
        popularCategories: ['DJs', 'Magicians', 'Dancers', 'Photographers'],
        priceRange: 'PKR 20,000 - 200,000',
    },
    {
        id: 'mehendi',
        name: 'Mehendi',
        slug: 'mehendi',
        description: 'Traditional mehendi ceremony entertainment and services',
        image: 'https://images.unsplash.com/photo-1583089892943-c63bc8a9e03e?w=800',
        popularCategories: ['Mehndi Artists', 'Singers', 'Dancers', 'DJs'],
        priceRange: 'PKR 30,000 - 300,000',
    },
    {
        id: 'concert',
        name: 'Concert',
        slug: 'concert',
        description: 'Book top artists for live concerts and music events',
        image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800',
        popularCategories: ['Singers', 'Musicians', 'DJs'],
        priceRange: 'PKR 200,000 - 5,000,000+',
    },
];

// Event Packages
export const eventPackages = [
    {
        id: 1,
        name: 'Wedding Starter',
        slug: 'wedding-starter',
        eventType: 'wedding',
        description: 'Essential entertainment package for intimate weddings',
        price: 'PKR 250,000',
        includes: ['Singer (2 hours)', 'DJ (4 hours)', 'Photography (Basic)'],
        popular: false,
    },
    {
        id: 2,
        name: 'Grand Wedding',
        slug: 'grand-wedding',
        eventType: 'wedding',
        description: 'Complete entertainment solution for your dream wedding',
        price: 'PKR 800,000',
        includes: ['Celebrity Singer', 'DJ (Full Night)', 'Photography + Videography', 'Makeup Artist', 'Mehndi Artist'],
        popular: true,
    },
    {
        id: 3,
        name: 'Corporate Premium',
        slug: 'corporate-premium',
        eventType: 'corporate',
        description: 'Professional entertainment for corporate excellence',
        price: 'PKR 350,000',
        includes: ['Professional Anchor', 'Stand-up Comedian', 'Live Band (2 hours)'],
        popular: true,
    },
    {
        id: 4,
        name: 'Birthday Bash',
        slug: 'birthday-bash',
        eventType: 'birthday',
        description: 'Make birthdays memorable with our fun package',
        price: 'PKR 80,000',
        includes: ['DJ (3 hours)', 'Photographer', 'Magician'],
        popular: false,
    },
    {
        id: 5,
        name: 'Mehendi Night',
        slug: 'mehendi-night',
        eventType: 'mehendi',
        description: 'Traditional mehendi ceremony package',
        price: 'PKR 150,000',
        includes: ['Mehndi Artist (Team)', 'Folk Singer', 'Dhol Players'],
        popular: false,
    },
];

// Testimonials
export const testimonials = [
    {
        id: 1,
        name: 'Ayesha & Bilal',
        event: 'Wedding',
        location: 'Lahore',
        date: 'December 2024',
        image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=400',
        rating: 5,
        testimonial: 'Artist Factory made our wedding absolutely magical! The singer they recommended was incredible and had everyone on their feet all night.',
        artistBooked: 'Ali Zafar',
    },
    {
        id: 2,
        name: 'Tech Corp Pakistan',
        event: 'Corporate Gala',
        location: 'Karachi',
        date: 'November 2024',
        image: 'https://images.unsplash.com/photo-1540575467063-178a50c6b2a6?w=400',
        rating: 5,
        testimonial: 'Professional service from start to finish. The comedian they suggested was perfect for our company culture.',
        artistBooked: 'Stand-up Artist',
    },
    {
        id: 3,
        name: 'Fatima Hassan',
        event: 'Birthday Party',
        location: 'Islamabad',
        date: 'October 2024',
        image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=400',
        rating: 5,
        testimonial: 'Best birthday party ever! The DJ knew exactly how to keep the energy high. Highly recommend!',
        artistBooked: 'DJ Faisal',
    },
];

// Blog Posts
export const blogPosts = [
    {
        id: 1,
        title: 'Top 10 Wedding Singers in Lahore 2024',
        slug: 'top-10-wedding-singers-lahore-2024',
        excerpt: 'Discover the most sought-after wedding singers in Lahore who can make your special day truly memorable.',
        image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800',
        category: 'Wedding Tips',
        author: 'Artist Factory Team',
        date: 'January 15, 2024',
        readTime: '5 min read',
    },
    {
        id: 2,
        title: 'How to Plan a Perfect Corporate Event',
        slug: 'how-to-plan-perfect-corporate-event',
        excerpt: 'A complete guide to organizing a successful corporate event with the right entertainment.',
        image: 'https://images.unsplash.com/photo-1540575467063-178a50c6b2a6?w=800',
        category: 'Event Planning',
        author: 'Artist Factory Team',
        date: 'January 10, 2024',
        readTime: '7 min read',
    },
    {
        id: 3,
        title: 'Mehendi Night Music: Traditional vs Modern',
        slug: 'mehendi-night-music-traditional-vs-modern',
        excerpt: 'Exploring the perfect musical blend for your mehendi ceremony.',
        image: 'https://images.unsplash.com/photo-1583089892943-c63bc8a9e03e?w=800',
        category: 'Mehendi',
        author: 'Artist Factory Team',
        date: 'January 5, 2024',
        readTime: '4 min read',
    },
    {
        id: 4,
        title: '5 Questions to Ask Before Booking a DJ',
        slug: '5-questions-before-booking-dj',
        excerpt: 'Essential questions to ensure you book the right DJ for your event.',
        image: 'https://images.unsplash.com/photo-1571266028243-e4733b0f0bb0?w=800',
        category: 'Booking Guide',
        author: 'Artist Factory Team',
        date: 'December 28, 2023',
        readTime: '3 min read',
    },
];

// Video Showcases
export const videoShowcases = [
    {
        id: 1,
        title: 'Ali Zafar Live at Grand Wedding',
        artist: 'Ali Zafar',
        thumbnail: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800',
        videoUrl: 'https://youtube.com/watch?v=example1',
        duration: '4:32',
        views: '125K',
        category: 'Wedding',
    },
    {
        id: 2,
        title: 'Best Corporate Event Performance',
        artist: 'Live Band',
        thumbnail: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800',
        videoUrl: 'https://youtube.com/watch?v=example2',
        duration: '6:15',
        views: '45K',
        category: 'Corporate',
    },
    {
        id: 3,
        title: 'DJ Faisal Birthday Party Mix',
        artist: 'DJ Faisal',
        thumbnail: 'https://images.unsplash.com/photo-1571266028243-e4733b0f0bb0?w=800',
        videoUrl: 'https://youtube.com/watch?v=example3',
        duration: '3:45',
        views: '89K',
        category: 'Birthday',
    },
    {
        id: 4,
        title: 'Traditional Mehendi Performance',
        artist: 'Folk Artists',
        thumbnail: 'https://images.unsplash.com/photo-1583089892943-c63bc8a9e03e?w=800',
        videoUrl: 'https://youtube.com/watch?v=example4',
        duration: '5:20',
        views: '67K',
        category: 'Mehendi',
    },
];

// FAQ Data
export const faqData = [
    {
        category: 'Booking Process',
        questions: [
            {
                question: 'How do I book an artist?',
                answer: 'Simply browse our categories, select an artist you like, and click "See Price & Book". Fill out the inquiry form with your event details and we\'ll get back to you within 24 hours with availability and pricing.',
            },
            {
                question: 'How far in advance should I book?',
                answer: 'We recommend booking at least 2-4 weeks in advance for most artists. For celebrity artists or peak wedding season, 2-3 months advance booking is advisable.',
            },
            {
                question: 'Can I meet the artist before booking?',
                answer: 'Yes! For major bookings, we can arrange a virtual or in-person meeting with the artist to discuss your requirements.',
            },
        ],
    },
    {
        category: 'Pricing & Payment',
        questions: [
            {
                question: 'What is included in the quoted price?',
                answer: 'Prices typically include the artist\'s performance fee, basic sound equipment, and travel within the city. Additional requirements like special equipment or out-of-city travel may incur extra charges.',
            },
            {
                question: 'What payment methods do you accept?',
                answer: 'We accept bank transfers, JazzCash, EasyPaisa, and credit/debit cards. A 50% advance is required to confirm the booking.',
            },
            {
                question: 'Is there a cancellation policy?',
                answer: 'Cancellations made 7+ days before the event receive a 50% refund. Cancellations within 7 days are non-refundable. We recommend event insurance for high-value bookings.',
            },
        ],
    },
    {
        category: 'Event Day',
        questions: [
            {
                question: 'What time will the artist arrive?',
                answer: 'Artists typically arrive 1-2 hours before performance time for setup and sound check. Exact timing will be coordinated with you beforehand.',
            },
            {
                question: 'Do artists bring their own equipment?',
                answer: 'Most artists bring basic equipment. For larger events, you may need to arrange professional sound and lighting systems. We can help coordinate this.',
            },
            {
                question: 'Can I make song requests?',
                answer: 'Absolutely! Most artists welcome song requests. You can share your playlist preferences in advance for a customized performance.',
            },
        ],
    },
];
