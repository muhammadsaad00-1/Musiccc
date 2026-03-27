import Link from 'next/link';
import { ArrowLeft, FileText } from 'lucide-react';

export default function TermsAndConditionsPage() {
    return (
        <div className="min-h-screen bg-[#0a0a0b] py-20 lg:py-32 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px]" />
            </div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="mb-8">
                    <Link href="/" className="inline-flex items-center text-gray-400 hover:text-orange-500 transition-colors font-medium">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Home
                    </Link>
                </div>

                <div className="bg-[#111113]/80 backdrop-blur-xl border border-gray-800/60 rounded-3xl p-8 md:p-14 shadow-2xl">
                    {/* Header */}
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-xl flex items-center justify-center border border-purple-500/20">
                            <FileText className="w-6 h-6 text-purple-400" />
                        </div>
                        <div>
                            <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight">Terms & Conditions</h1>
                        </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 mb-12 pb-8 border-b border-gray-800">
                        <div className="text-purple-400 font-medium tracking-wide">
                            Category: <span className="text-gray-300">Artist Bookings</span>
                        </div>
                        <div className="hidden sm:block w-1.5 h-1.5 rounded-full bg-gray-700"></div>
                        <div className="text-purple-400 font-medium tracking-wide">
                            Effective Date: <span className="text-gray-300">01-Jan-2019</span>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="space-y-10 text-gray-300 leading-relaxed">
                        <section>
                            <p className="text-lg">
                                These Terms & Conditions govern all bookings and services provided by <strong>Artist Factory</strong> through its website <a href="https://www.artistfactory.co" className="text-purple-400 hover:underline">www.artistfactory.co</a> and through direct agreements with clients.
                            </p>
                            <p className="mt-4 font-medium text-white p-4 bg-gray-800/30 rounded-xl border border-gray-800">
                                By booking an artist through Artist Factory, the client agrees to the following terms.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                                <span className="text-purple-500">1.</span> Nature of Services
                            </h2>
                            <p className="mb-4">Artist Factory is an artist management and booking company providing services including but not limited to:</p>
                            <ul className="list-disc list-inside space-y-2 text-gray-400 ml-4 mb-6">
                                <li>Artist booking</li>
                                <li>Talent management</li>
                                <li>Corporate entertainment services</li>
                                <li>Live music performances</li>
                                <li>Event entertainment production</li>
                            </ul>
                            <p className="mb-2"><strong>Artist Factory acts as a booking intermediary</strong> between the client and the artist.</p>
                            <p className="text-gray-400 italic">All bookings are subject to artist availability and written confirmation.</p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                                <span className="text-purple-500">2.</span> Booking Confirmation & Advance Payment
                            </h2>
                            <p className="mb-3 font-medium text-white">To confirm an artist booking:</p>
                            <ul className="list-disc list-inside space-y-2 text-gray-400 ml-4 mb-6">
                                <li><strong className="text-gray-200">50% advance payment</strong> of the total booking fee is required.</li>
                                <li>The booking is considered confirmed only after receipt of the advance payment.</li>
                                <li>The advance payment is <strong className="text-red-400">non-refundable</strong> if the client cancels the event.</li>
                            </ul>
                            
                            <p className="mb-3">However, the event may be postponed instead of cancelled, subject to:</p>
                            <ul className="list-disc list-inside space-y-2 text-gray-400 ml-4 mb-4">
                                <li>Artist availability</li>
                                <li>Mutual agreement between both parties</li>
                            </ul>
                            
                            <div className="bg-orange-500/10 border border-orange-500/20 p-4 rounded-xl">
                                <p className="text-orange-300 font-medium mb-2">Rescheduling Policy:</p>
                                <p className="text-sm">The new event date must be within <strong>one (1) month</strong> of the original booking date. If the event is rescheduled beyond one month, any price escalation or additional costs must be paid by the client.</p>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                                <span className="text-purple-500">3.</span> Balance Payment
                            </h2>
                            <p className="mb-4 text-lg">The remaining <strong className="text-white">50% balance payment</strong> must be cleared before the performance begins.</p>
                            
                            <h3 className="text-xl font-semibold text-gray-100 mb-3">Payment conditions:</h3>
                            <ul className="list-disc list-inside space-y-2 text-gray-400 ml-4 mb-4">
                                <li>Payment must be made in cash or bank transfer.</li>
                                <li><strong className="text-red-400">Cheques and pay orders are not accepted.</strong></li>
                                <li>For A-Class artists, the balance payment must be cleared at least <strong>seven (7) days</strong> prior to the event date.</li>
                            </ul>
                            <p className="text-red-400 font-medium bg-red-500/10 p-3 rounded-lg border border-red-500/20">
                                Failure to clear the balance payment may result in cancellation of the performance without refund of the advance.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                                <span className="text-purple-500">4.</span> Artist Unavailability
                            </h2>
                            <p className="mb-3">In rare circumstances where the artist cannot perform due to reasons beyond their control, including but not limited to:</p>
                            <ul className="list-disc list-inside space-y-2 text-gray-400 ml-4 mb-4">
                                <li>Serious illness</li>
                                <li>Major accident</li>
                                <li>Flight cancellation or travel disruption</li>
                                <li>Any severe unavoidable circumstance</li>
                            </ul>
                            <p className="mb-4 text-green-400 font-medium bg-green-500/10 p-3 rounded-lg border border-green-500/20">...the full advance payment will be refunded to the client.</p>
                            <p className="text-gray-400">Artist Factory will also attempt, where possible, to offer an alternative artist of similar category, subject to client approval.</p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                                <span className="text-purple-500">5.</span> Equipment & Instrument Damage
                            </h2>
                            <p className="mb-3">The client shall be responsible for any damage caused to the artist’s instruments, technical equipment, or performance gear at the venue due to:</p>
                            <ul className="list-disc list-inside space-y-2 text-gray-400 ml-4 mb-4">
                                <li>Negligence</li>
                                <li>Mishandling</li>
                                <li>Improper venue arrangements</li>
                                <li>Crowd interference</li>
                            </ul>
                            <p className="font-medium text-white">The client agrees to fully compensate for repair or replacement costs.</p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                                <span className="text-purple-500">6.</span> Sound System Requirements
                            </h2>
                            <ul className="space-y-4 text-gray-400">
                                <li className="flex items-start">
                                    <span className="text-purple-500 mr-2 mt-1">▪</span>
                                    <span>If the client is responsible for providing the sound system, it must meet professional performance standards suitable for the artist.</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-purple-500 mr-2 mt-1">▪</span>
                                    <span>If the sound system is not up to the required professional standard, the artist reserves the right to refuse to perform until the issue is resolved.</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-purple-500 mr-2 mt-1">▪</span>
                                    <span className="text-white font-medium">Any delay or cancellation caused by poor sound arrangements will be the responsibility of the client.</span>
                                </li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                                <span className="text-purple-500">7.</span> Event Responsibilities
                            </h2>
                            <p className="mb-3 text-white font-medium">Unless otherwise agreed in writing, the client is responsible for:</p>
                            <ul className="list-disc list-inside space-y-2 text-gray-400 ml-4 mb-4">
                                <li>Venue arrangements</li>
                                <li>Stage setup</li>
                                <li>Sound and lighting (if not provided by Artist Factory)</li>
                                <li>Security and crowd control</li>
                                <li>Event permissions and licenses</li>
                                <li>Accommodation and travel arrangements if required</li>
                            </ul>
                            <p className="text-gray-300">The client must ensure the performance environment is safe and suitable for the artist and technical team.</p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                                <span className="text-purple-500">8.</span> Force Majeure
                            </h2>
                            <p className="mb-3">Neither Artist Factory nor the artist shall be held responsible for failure to perform due to circumstances beyond reasonable control, including but not limited to:</p>
                            <ul className="list-disc list-inside space-y-2 text-gray-400 ml-4 mb-4">
                                <li>Natural disasters</li>
                                <li>Government restrictions</li>
                                <li>Political unrest or riots</li>
                                <li>Pandemic or public health restrictions</li>
                                <li>War or terrorism</li>
                                <li>Venue shutdowns</li>
                            </ul>
                            <p className="mb-2 text-gray-300">In such cases, the event may be rescheduled to a mutually agreed date.</p>
                            <p className="text-gray-400 italic">Refunds or adjustments will be handled based on the specific circumstances and agreements.</p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                                <span className="text-purple-500">9.</span> Client Liability & Event Safety
                            </h2>
                            <p className="mb-3 text-white font-medium">The client is responsible for ensuring:</p>
                            <ul className="list-disc list-inside space-y-2 text-gray-400 ml-4 mb-6">
                                <li>Adequate security arrangements</li>
                                <li>Crowd management</li>
                                <li>Compliance with local laws and regulations</li>
                                <li>Safety of the artist, crew, and equipment</li>
                            </ul>
                            <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl">
                                <p className="text-white mb-2">If the artist or management believes that safety conditions are compromised, the artist reserves the right to refuse or stop the performance.</p>
                                <p className="text-red-400 font-bold uppercase tracking-wide text-sm">In such cases, no refund will be issued.</p>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                                <span className="text-purple-500">10.</span> Recording & Broadcasting Rights
                            </h2>
                            <p className="mb-3">The client may <strong className="text-pink-400">not</strong> record, broadcast, livestream, or commercially distribute the artist’s performance without prior written permission from Artist Factory and the artist.</p>
                            <p className="text-gray-400">Unauthorized recording, broadcasting, or commercial use of the performance may result in legal action and compensation claims.</p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                                <span className="text-purple-500">11.</span> Intellectual Property
                            </h2>
                            <p className="mb-3">All content on the website including:</p>
                            <ul className="list-disc list-inside space-y-2 text-gray-400 ml-4 mb-4">
                                <li>Logos</li>
                                <li>Videos</li>
                                <li>Images</li>
                                <li>Artist promotional material</li>
                                <li>Text content</li>
                            </ul>
                            <p className="text-gray-300">...is the intellectual property of Artist Factory or its partners and may not be reproduced without permission.</p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                                <span className="text-purple-500">12.</span> Changes to Terms
                            </h2>
                            <p>Artist Factory reserves the right to modify these Terms & Conditions at any time. Updated terms will be published on the website.</p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                                <span className="text-purple-500">13.</span> Governing Law
                            </h2>
                            <p>These Terms & Conditions shall be governed by the laws of Pakistan.</p>
                        </section>

                        <section className="bg-[#1a1a1c] p-6 rounded-2xl border border-gray-800/80 mt-12">
                            <h2 className="text-xl font-bold text-white mb-4">14. Contact Information</h2>
                            <p className="text-gray-400 mb-2">For booking inquiries or legal matters, please contact:</p>
                            <div className="text-white font-medium">
                                <p className="text-purple-400 font-bold text-lg mb-1">Artist Factory</p>
                                <p>Website: <a href="https://www.artistfactory.co" className="text-blue-400 hover:underline">www.artistfactory.co</a></p>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
}
