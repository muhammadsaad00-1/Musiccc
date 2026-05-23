'use client';

import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, ArrowRight, Loader2, Calendar, Users, CheckCircle, MapPin, Music, ChevronDown, Star } from 'lucide-react';
import { useState, useEffect, use } from 'react';
import ArtistCard from '@/components/artists/ArtistCard';
import FAQSection from '@/components/ui/FAQSection';
import PerformerCarousel from '@/components/events/PerformerCarousel';
import HowItWorks from '@/components/home/HowItWorks';
import CTASection from '@/components/home/CTASection';
import { API_BASE_URL } from '@/lib/api';

interface EventTypePageProps {
    params: Promise<{ type: string }>;
}

interface BackendEvent {
    id: string;
    name: string;
    description: string;
    event_recommendations: string;
    pricing: number;
    header_image_url: string;
    performers: any[];
}

// Hero background images for each event type
const eventHeroImages: Record<string, string[]> = {
    wedding: [
        "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&q=80"
    ],
    mehendi: [
        "https://images.unsplash.com/photo-1583089892943-e02e5b017b6a?auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80"
    ],
    concert: [
        "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?auto=format&fit=crop&q=80"
    ],
    corporate: [
        "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&q=80"
    ],
    birthday: [
        "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1464349153735-7db50ed83c84?auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&q=80"
    ],
    "college-event": [
        "https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1525926472895-3ab76af430f8?auto=format&fit=crop&q=80"
    ],
    "resort-event": [
        "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1599839619722-39751411ea63?auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&q=80"
    ],
    festival: [
        "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&q=80"
    ],
    "cultural-exchange": [
        "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&q=80"
    ],
    "embassy-diplomatic": [
        "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80"
    ],
    "government-event": [
        "https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80"
    ],
    default: [
        "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?auto=format&fit=crop&q=80"
    ]
};

// Event type configurations
const eventConfigs: Record<string, { name: string; description: string; icon: string }> = {
    wedding: {
        name: "Wedding",
        description: "Create magical moments with world-class entertainment for your special day",
        icon: "💍"
    },
    mehendi: {
        name: "Mehendi",
        description: "Traditional celebrations deserve extraordinary performances and vibrant music",
        icon: "🌙"
    },
    concert: {
        name: "Concert",
        description: "Electrifying live performances that create unforgettable musical experiences",
        icon: "🎭"
    },
    corporate: {
        name: "Corporate Event",
        description: "Professional entertainment solutions for conferences, galas, and corporate celebrations",
        icon: "🏢"
    },
    birthday: {
        name: "Birthday Party",
        description: "Make every birthday celebration special with talented performers and engaging artist acts",
        icon: "🎂"
    },
    "private-party": {
        name: "Private Party",
        description: "Exclusive entertainment for intimate gatherings and celebrations",
        icon: "🎉"
    },
    "college-event": {
        name: "College Event",
        description: "High-energy performances, DJs, and bands perfect for university fests and campus parties",
        icon: "🎓"
    },
    "resort-event": {
        name: "Luxury Cruise & Resort Event",
        description: "Premium, sophisticated entertainment tailored for destination weddings, cruises, and resort galas",
        icon: "🛳️"
    },
    festival: {
        name: "Festival",
        description: "Enthrall large audiences with headlining acts, live bands, and high-energy cultural performers",
        icon: "🎪"
    },
    "cultural-exchange": {
        name: "Cultural Exchange",
        description: "Celebrate global heritage with authentic folk dancers, classical musicians, and traditional troupes",
        icon: "🌍"
    },
    "embassy-diplomatic": {
        name: "Embassy & Diplomatic Event",
        description: "Exquisite, sophisticated entertainment curated for national celebrations, galas, and VIP diplomatic receptions",
        icon: "🤝"
    },
    "government-event": {
        name: "Government Event",
        description: "Dignified and elegant entertainment featuring national anthems, classical recitals, and respectful live performances",
        icon: "🏛️"
    },
};

export default function EventTypePage({ params }: EventTypePageProps) {
    const { type } = use(params);
    const [event, setEvent] = useState<any>(null);
    const [relevantArtists, setRelevantArtists] = useState<any[]>([]);
    const [relevantCategories, setRelevantCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [heroImageIndex, setHeroImageIndex] = useState(0);
    const [activeCategory, setActiveCategory] = useState<string | null>(null);

    // Auto-advance hero carousel
    useEffect(() => {
        const images = eventHeroImages[type] || eventHeroImages.default;
        const interval = setInterval(() => {
            setHeroImageIndex((current) => (current + 1) % images.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [type]);

    useEffect(() => {
        const fetchEventData = async () => {
            setLoading(true);

            // Check if it's a known event type
            const eventConfig = eventConfigs[type];

            try {
                // Try to fetch from backend
                const response = await fetch(`${API_BASE_URL}/events`);
                if (response.ok) {
                    const backendEvents: BackendEvent[] = await response.json();
                    const createSlug = (name: string) => {
                        return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
                    };

                    const backendEvent = backendEvents.find(
                        (e) => createSlug(e.name) === type
                    );

                    if (backendEvent) {
                        setEvent({
                            ...backendEvent,
                            slug: type,
                            name: backendEvent.name,
                            description: backendEvent.description,
                            image: backendEvent.header_image_url,
                        });

                        // Transform performers
                        if (backendEvent.performers && backendEvent.performers.length > 0) {
                            const transformedPerformers = backendEvent.performers.map((performer: any) => ({
                                ...performer,
                                image_url: performer.profile_image_url || performer.image_url,
                                slug: performer.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
                                location: performer.locations && performer.locations.length > 0 ? performer.locations[0] : 'Pakistan',
                                short_bio: performer.description,
                                price_range: performer.price ? `PKR ${performer.price.toLocaleString()}+` : 'Contact for pricing',
                                category_id: performer.category,
                                bio: performer.description
                            }));
                            setRelevantArtists(transformedPerformers);
                        }
                    } else if (eventConfig) {
                        // Use config for known event types
                        setEvent({
                            name: eventConfig.name,
                            description: eventConfig.description,
                            icon: eventConfig.icon,
                            slug: type,
                        });

                        // Fetch relevant artists based on event type
                        await fetchRelevantArtistsForEvent(type);
                    } else {
                        notFound();
                    }
                } else if (eventConfig) {
                    setEvent({
                        name: eventConfig.name,
                        description: eventConfig.description,
                        icon: eventConfig.icon,
                        slug: type,
                    });
                    // Fetch relevant artists
                    await fetchRelevantArtistsForEvent(type);
                }
            } catch (error) {
                console.error('Failed to fetch event:', error);
                if (eventConfig) {
                    setEvent({
                        name: eventConfig.name,
                        description: eventConfig.description,
                        icon: eventConfig.icon,
                        slug: type,
                    });
                    // Fetch relevant artists
                    await fetchRelevantArtistsForEvent(type);
                }
            } finally {
                setLoading(false);
            }
        };

        // Function to fetch relevant artists and categories for event type
        const fetchRelevantArtistsForEvent = async (eventType: string) => {
            try {
                // Fetch ALL categories from backend (Unfiltered as requested)
                const categoriesRes = await fetch(`${API_BASE_URL}/categories`);
                if (categoriesRes.ok) {
                    const allCategories = await categoriesRes.json();
                    setRelevantCategories(allCategories);

                    // Set initial active category if available
                    if (allCategories.length > 0) {
                        setActiveCategory(allCategories[0].name.toLowerCase());
                    }
                }

                // Fetch performers (Grouped by category in carousel)
                const performersRes = await fetch(`${API_BASE_URL}/performers?limit=300`);
                if (performersRes.ok) {
                    const data = await performersRes.json();
                    const allPerformers = data.data || data;

                    const transformed = allPerformers
                        .map((performer: any) => ({
                            id: performer.id,
                            name: performer.name,
                            image_url: performer.profile_image_url || performer.image_url,
                            slug: performer.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
                            location: performer.locations && performer.locations.length > 0 ? performer.locations[0] : 'Pakistan',
                            short_bio: performer.description?.substring(0, 80),
                            price_range: performer.price ? `PKR ${performer.price.toLocaleString()}+` : 'Contact for pricing',
                            category_id: performer.category,
                            bio: performer.description,
                            is_verified: true,
                            is_featured: false,
                        }));

                    setRelevantArtists(transformed);
                }
            } catch (error) {
                console.error('Error fetching relevant artists:', error);
            }
        };

        fetchEventData();
    }, [type]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0a0a0b] flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
            </div>
        );
    }

    if (!event) {
        notFound();
    }

    const eventConfig = eventConfigs[type];
    const heroImages = eventHeroImages[type] || eventHeroImages.default;

    return (
        <div className="min-h-screen bg-[#0a0a0b]">
            {/* Hero with Background Image Carousel */}
            <section className="relative min-h-[450px] lg:min-h-[500px] flex items-center overflow-hidden">
                {/* Background Image Carousel */}
                <div className="absolute inset-0">
                    <Image
                        key={heroImageIndex}
                        src={heroImages[heroImageIndex]}
                        alt={`${event.name} background`}
                        fill
                        className="object-cover transition-opacity duration-1000"
                        priority
                    />
                    {/* Dark overlay for readability */}
                    <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-[#0a0a0b]" />
                    {/* Colored gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-900/20 via-transparent to-purple-900/20" />
                </div>

                {/* Gradient orbs */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-10 left-10 w-72 h-72 bg-orange-500/20 rounded-full blur-[100px]" />
                    <div className="absolute bottom-10 right-10 w-96 h-96 bg-pink-600/15 rounded-full blur-[120px]" />
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-16">
                    <Link
                        href="/events"
                        className="inline-flex items-center gap-2 text-gray-300 hover:text-white transition-colors mb-8 group"
                    >
                        <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center group-hover:border-orange-500/50 group-hover:bg-orange-500/20 transition-all">
                            <ArrowLeft className="w-4 h-4" />
                        </div>
                        <span className="text-sm font-medium">All Events</span>
                    </Link>

                    <div className="text-center max-w-4xl mx-auto">
                        {/* Event badge */}
                        <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-orange-500/20 to-pink-500/20 backdrop-blur-sm rounded-full text-orange-300 text-base font-semibold mb-8 border border-orange-500/30">
                            <span className="text-xl">{eventConfig?.icon || '🎉'}</span>
                            <span>{event.name} Entertainment</span>
                        </div>

                        <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-black mb-6 drop-shadow-2xl leading-tight">
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-orange-100 to-white">Book for</span>{' '}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-pink-500 to-purple-500 animate-gradient bg-size-200">
                                {event.name}
                            </span>
                            <span className="block text-2xl sm:text-3xl lg:text-4xl font-medium mt-4">
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-200 via-purple-200 to-pink-200">
                                    Make It Unforgettable
                                </span>
                            </span>
                        </h1>

                        <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-6">
                            {event.description}
                        </p>

                        <div className="flex items-center justify-center gap-4 text-sm flex-wrap">
                            <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full">
                                <Users className="w-4 h-4 text-orange-400" />
                                <span className="text-white">{relevantArtists.length} Artists</span>
                            </div>
                            <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full">
                                <CheckCircle className="w-4 h-4 text-green-400" />
                                <span className="text-white">Verified Professionals</span>
                            </div>
                            <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full">
                                <Calendar className="w-4 h-4 text-purple-400" />
                                <span className="text-white">Instant Booking</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Carousel indicators */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                    {heroImages.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => setHeroImageIndex(idx)}
                            className={`w-2 h-2 rounded-full transition-all ${idx === heroImageIndex
                                ? 'bg-orange-500 w-6'
                                : 'bg-white/30 hover:bg-white/50'
                                }`}
                        />
                    ))}
                </div>
            </section>

            {/* Pick Your Performer Component */}
            <PerformerCarousel
                eventName={event.name}
                categories={relevantCategories}
                artists={relevantArtists}
            />

            <HowItWorks />



            <CTASection />

            {/* FAQs Section */}
            <FAQSection
                title="Event Questions?"
                subtitle={`Everything you need to know about booking entertainment for ${event.name} events`}
                faqs={
                    type === 'wedding' ? [
                        { question: "How far in advance should I book singers or live bands for a wedding?", answer: "Wedding dates follow heavy seasonal peaks (e.g., winter). We highly recommend booking 3 to 6 months in advance to secure top-tier Qawwals, Live Bands, and Singers before their calendars fill up." },
                        { question: "Can the artist customize their setlist for the Baraat or Rukhsati?", answer: "Absolutely. Once booked, you can connect with the artist directly via WhatsApp to discuss specific songs for entry moments, couple dances, or background routines." },
                        { question: "Who provides the sound and stage equipment?", answer: "It depends on the artist's tier. Popular Live Bands and Qawwals typically bring their own sound technicians (and sometimes basic gear), but the core PA system, stage, and lighting are usually the responsibility of your marquee or event planner. We can help clarify this in your booking chat." },
                        { question: "How does the payment and deposit work?", answer: "Artists generally require a 30% to 50% non-refundable advance deposit to block the date. The remaining balance is typically paid in cash prior to the performance on the day of the event." },
                        { question: "What if the event gets delayed on the day?", answer: "Pakistani weddings often run late. Most artists have a specific time-block they commit to (e.g., 2-3 hours). If expectations stretch beyond this due to extreme delays, they may charge overtime. It is best to communicate a realistic timeline upfront." }
                    ] : type === 'corporate' ? [
                        { question: "Are the artists equipped for formal corporate environments?", answer: "Yes. For corporate events, we filter for Anchors/Emcees, Comedians, and Musicians who specialize in professional, family-friendly, and brand-appropriate entertainment." },
                        { question: "Do you issue official invoices for corporate records?", answer: "Yes, once booking terms are finalized directly with the management, official invoices and NTN details can be provided for your company's finance department." },
                        { question: "How long do performances typically last at annual dinners?", answer: "Set lengths vary. Anchors manage the entire 3-4 hour flow, Comedians typically perform a tight 30-45 minute set, and Live Bands perform in blocks of 45-60 minutes depending on the agenda." },
                        { question: "Can the comedian or host incorporate our company's inside jokes?", answer: "Definitely. Most corporate entertainers prefer receiving a brief prior to the event so they can tailor their script, acknowledge VIPs, and include safe, relatable company anecdotes." },
                        { question: "What are the technical requirements for a corporate booking?", answer: "You will receive a technical rider detailing the artist's required microphones (collar vs handheld), monitor speakers, plugging requirements, and lighting suggestions to ensure seamless execution." }
                    ] : type === 'concert' ? [
                        { question: "Can you handle ticketing and venue management as well?", answer: "The Artist Factory platform specifically connects you with the talent. Venue booking, ticketing, and event security are handled by the organizers, though our team can refer you to trusted production partners." },
                        { question: "What is the typical backstage and hospitality requirement (Rider)?", answer: "A-list artists require a detailed hospitality rider including dedicated green rooms, specific refreshments, security protocols, and sometimes travel/accommodation. This is negotiated alongside their performance fee." },
                        { question: "Do concert artists bring their own entire sound setup?", answer: "No. Artists bring their instruments and a dedicated sound engineer. The organizer must rent a line-array PA system, backline monitors, and lighting rigs according to the 'Tech Rider' provided by the artist's team." },
                        { question: "How do we handle travel and accommodation for out-of-city artists?", answer: "If the artist is traveling from Lahore/Karachi/Islamabad, the organizer is responsible for business/economy class flights, 4-star+ hotel accommodations, and dedicated local transport for the artist and their entire crew." }
                    ] : type === 'mehendi' ? [
                        { question: "Who are the most popular performers for a Mehendi?", answer: "Mehendis are high-energy events! DJs, Dhol players, Bhangra artists, and upbeat Live Bands are the top choices to keep the dance floor packed." },
                        { question: "Can the DJ coordinate with our family dance performances?", answer: "Yes. You can share your pre-mixed dance tracks via USB or cloud link before the event. The DJ will cue them up exactly according to your family's dance sequence." },
                        { question: "Is there a limit to how late the performer can play?", answer: "This largely depends on your venue and local city ordinances (which often enforce strict 10 PM or 11 PM curfews for loud music). Artists will perform up until the venue cuts the power." },
                        { question: "Do the artists require a stage?", answer: "While DJs can work from a corner console, Live Bands, Dhol players, and Singers require a slightly elevated stage (even 1-2 feet high) so the crowd can see them and to prevent equipment damage from dancing guests." }
                    ] : type === 'birthday' ? [
                        { question: "What entertainment works best for adult vs kid birthdays?", answer: "For adults, acoustic singers, private DJs, or Ghazal artists create a great vibe. For kids, magicians, jugglers, face painters, and interactive emcees are much more suitable." },
                        { question: "Can the singer perform the 'Happy Birthday' song during the cake cutting?", answer: "Of course! Just coordinate the exact timing with them before they start their set so they can integrate it seamlessly into the celebration." },
                        { question: "Is the pricing different for smaller, private house parties?", answer: "Yes, many artists offer a scaled-down 'acoustic' or 'unplugged' rate for smaller gatherings of 30-50 people that require less intense sound equipment." }
                    ] : type === 'college-event' ? [
                        { question: "Do you offer special packages or discounts for university/college budgets?", answer: "We understand that student councils and university societies work within specific budgets. Contact our management team directly; we frequently negotiate student-friendly terms with rising/indie artists and DJs tailored for campus events." },
                        { question: "What is the process for booking a high-profile headliner for a college fest?", answer: "Headliners typically require a 2-4 month advance booking during peak fest seasons (Feb-Apr). The process involves selecting an artist, signing a mutual contract between the booking agency and the student organizing committee, and paying a non-refundable advance." },
                        { question: "Who provides the tech rider equipment for college grounds?", answer: "The university's organizing committee is strictly responsible for securing the staging, trussing, line array sound systems, and backline instruments required in the artist's tech rider. The artist only provides their performance and sound engineer." },
                        { question: "How is campus security generally handled for large artists?", answer: "The artist's rider specifies security requirements. You must arrange for a dedicated green room and an official human barricade (bouncer team) to escort the artist from their vehicle directly to the stage to ensure safety in massive student crowds." }
                    ] : type === 'resort-event' ? [
                        { question: "Do artists travel for destination weddings or cruise bookings?", answer: "Absolutely. Many of our premium artists frequently travel for destination events, both domestically (e.g., Bhurban, Hunza) and internationally (e.g., UAE, Turkiye) for resort galas and closed cruise celebrations." },
                        { question: "Who covers the travel and accommodation for a resort event?", answer: "For out-of-city/international destination events, the client is responsible for booking and covering the flights (Business/Economy), local travel, 4/5-star accommodation, and meals for the artist and their entire designated crew." },
                        { question: "Can the performances be split into multiple smaller sets throughout the weekend?", answer: "Yes, many resort bookings operate on a 'weekend package' basis, where a musician performs a relaxed acoustic set for a welcome brunch, and a full band/DJ set for the main gala night. This must be detailed in the initial booking contract." },
                        { question: "Are passports and visas handled by your team for international cruises?", answer: "We provide the artists' official passport details, but the client must facilitate and sponsor the visa applications (including expedited processing fees) well in advance of the travel date." }
                    ] : type === 'festival' ? [
                        { question: "How early do we need to book headlining artists for a festival?", answer: "Festival headliners and A-list acts require bookings at least 4 to 6 months in advance. Their schedules are highly coordinated, and they require advance travel and stage logistics planning." },
                        { question: "Can you provide complete festival sound and stage management?", answer: "The Artist Factory specializes in connecting you with the artists and handling booking contracts. For sound, lights, and staging, we can introduce you to our trusted premium production partners." },
                        { question: "How are festival artist hospitality and technical riders managed?", answer: "Each headlining artist has a detailed tech rider (sound system specifications, monitor mixes) and a hospitality rider (green rooms, refreshments). Our management coordinates these riders between you and the artist's team to ensure smooth setups." }
                    ] : type === 'cultural-exchange' ? [
                        { question: "What type of artists are suitable for cultural exchange events?", answer: "Folk singers, classical instrumentalists, Sufi ensembles, and traditional dance troupes are ideal. They represent national heritage beautifully and engage diverse global audiences." },
                        { question: "Can artists customize their performances to fit a specific international theme?", answer: "Yes, classical and folk artists can prepare custom fusion sets or integrate traditional instruments from guest countries if coordinated well in advance of the event." },
                        { question: "Do you represent artists who travel internationally for cultural diplomacy?", answer: "Absolutely. Many of our premium classical and Sufi performers are seasoned international travelers with experience performing at embassies, global expos, and international festivals." }
                    ] : type === 'embassy-diplomatic' ? [
                        { question: "What are the security clearance requirements for embassy events?", answer: "We provide full passport, CNIC, and team detail sheets for all performing artists and crew members well in advance to comply with diplomatic security protocols." },
                        { question: "What genre of music is recommended for a VIP diplomatic reception?", answer: "Soft instrumental ensembles (harp, violin, flute), light classical instrumentals, or elegant Ghazal recitals work perfectly, providing an exquisite atmosphere without overpowering conversation." },
                        { question: "How do we handle international visas and travel for embassy bookings?", answer: "For events hosted outside the country, the embassy/host is responsible for sponsoring and facilitating fast-track visas and covering premium travel and lodging for the artist crew." }
                    ] : type === 'government-event' ? [
                        { question: "Are your artists familiar with official government protocols?", answer: "Yes. We have a selection of distinguished artists, anchors, and instrumentalists who are experienced in performing under strict state protocols, VIP seating arrangements, and formal event structures." },
                        { question: "Can you provide a classical instrumental national anthem recital?", answer: "Yes, our classical violinists, sitarists, and woodwind players can perform highly refined, respectful instrumental versions of the national anthem." },
                        { question: "What is the payment procedure for government-contracted events?", answer: "We accommodate official invoicing, NTN registrations, and standard state financial procedures, coordinating directly with your department's accounts team." }
                    ] : [ // default fallback for private party / other
                        { question: "How does the booking process work?", answer: `Find an artist you like, click 'Contact Us', and you will be directed to WhatsApp to speak instantly with booking management to finalize dates and pricing for your ${event.name.toLowerCase()}.` },
                        { question: "Are prices negotiable?", answer: "Prices listed are base estimates. Final pricing depends on your exact location, event duration, peak season demand, and required sound equipment." },
                        { question: "Is an advance payment required?", answer: "Yes, standard industry practice requires a 30-50% advance to block the artist's calendar. Dates are not reserved until the deposit is cleared." },
                        { question: "Can artists perform acoustic sets for smaller crowds?", answer: "Many singers and musicians offer stripped-down acoustic sets perfect for private dinners and intimate gatherings. Just ask during your inquiry!" }
                    ]
                }
            />

            {/* Looking for Something Else? CTA Section */}
            <section className="py-16 lg:py-20 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-orange-900/5 to-purple-900/10" />
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-[150px]" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-600/10 rounded-full blur-[150px]" />

                <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="bg-gradient-to-b from-[#1a1a1a]/80 to-[#151515]/80 backdrop-blur-xl rounded-3xl border border-gray-800/50 p-8 lg:p-12 shadow-2xl shadow-orange-500/5">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500/20 to-pink-600/20 rounded-full text-orange-400 text-sm font-medium mb-6 border border-orange-500/30">
                            <span className="text-lg">🎯</span>
                            <span>Can't Find What You're Looking For?</span>
                        </div>

                        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                            Looking for{' '}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-pink-500 to-purple-500">
                                Something Specific?
                            </span>
                        </h2>

                        <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto">
                            Tell us your requirements and we'll find the perfect entertainment for your {event.name.toLowerCase()}.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                href="/contact"
                                className="px-8 py-4 bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600 text-white font-bold rounded-xl shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 hover:-translate-y-1 transition-all"
                            >
                                Contact Us Now
                            </Link>
                            <Link
                                href="/post-requirement"
                                className="px-8 py-4 bg-[#1a1a1a] border border-gray-700 text-white font-bold rounded-xl hover:bg-[#252525] hover:border-orange-500/30 transition-all"
                            >
                                Post Your Requirement
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
