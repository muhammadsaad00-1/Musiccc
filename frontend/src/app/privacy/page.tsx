import Link from 'next/link';
import { ArrowLeft, Shield } from 'lucide-react';

export default function PrivacyPolicyPage() {
    return (
        <div className="min-h-screen bg-[#0a0a0b] py-20 lg:py-32 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute -top-40 -right-40 w-96 h-96 bg-orange-500/10 rounded-full blur-[120px]" />
                <div className="absolute top-1/2 -left-40 w-96 h-96 bg-pink-500/10 rounded-full blur-[120px]" />
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
                        <div className="w-12 h-12 bg-gradient-to-br from-orange-500/20 to-pink-500/20 rounded-xl flex items-center justify-center border border-orange-500/20">
                            <Shield className="w-6 h-6 text-orange-400" />
                        </div>
                        <div>
                            <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight">Privacy Policy</h1>
                        </div>
                    </div>
                    
                    <div className="text-orange-400 font-medium tracking-wide mb-12 pb-8 border-b border-gray-800">
                        Effective Date: <span className="text-gray-300">01-Jan-2019</span>
                    </div>

                    {/* Content */}
                    <div className="space-y-10 text-gray-300 leading-relaxed">
                        <section>
                            <p className="text-lg">
                                This Privacy Policy explains how <strong>Artist Factory</strong> (“we”, “our”, or “us”) collects, uses, and protects information when you visit or use <a href="https://www.artistfactory.co" className="text-orange-400 hover:underline">www.artistfactory.co</a>.
                            </p>
                            <p className="mt-4">
                                By using this website, you agree to the practices described in this policy.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                                <span className="text-orange-500">1.</span> Information We Collect
                            </h2>
                            <p className="mb-4">We may collect the following types of information:</p>
                            
                            <h3 className="text-xl font-semibold text-gray-100 mt-6 mb-3">Personal Information</h3>
                            <p className="mb-3">When you contact us, submit booking inquiries, or communicate with us through the website, we may collect:</p>
                            <ul className="list-disc list-inside space-y-2 text-gray-400 ml-4 mb-6">
                                <li>Name</li>
                                <li>Email address</li>
                                <li>Phone number</li>
                                <li>Company or organization name</li>
                                <li>Event details or booking requirements</li>
                            </ul>

                            <h3 className="text-xl font-semibold text-gray-100 mt-6 mb-3">Technical Information</h3>
                            <p className="mb-3">When you visit our website, certain information may automatically be collected, such as:</p>
                            <ul className="list-disc list-inside space-y-2 text-gray-400 ml-4 mb-4">
                                <li>IP address</li>
                                <li>Browser type</li>
                                <li>Device information</li>
                                <li>Pages visited</li>
                                <li>Time and date of website visits</li>
                            </ul>
                            <p className="text-gray-400 italic">This information helps us improve website performance and user experience.</p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                                <span className="text-orange-500">2.</span> How We Use Your Information
                            </h2>
                            <p className="mb-4">The information collected may be used to:</p>
                            <ul className="list-disc list-inside space-y-2 text-gray-400 ml-4 mb-4">
                                <li>Respond to booking inquiries</li>
                                <li>Provide artist booking and management services</li>
                                <li>Communicate with clients and partners</li>
                                <li>Improve our website and services</li>
                                <li>Send relevant information about our services (if requested)</li>
                            </ul>
                            <p className="font-medium text-gray-200">We will only use your information for legitimate business purposes related to our services.</p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                                <span className="text-orange-500">3.</span> Sharing of Information
                            </h2>
                            <p className="font-medium text-white mb-4">We do <span className="text-pink-400">not</span> sell or rent personal information to third parties.</p>
                            <p className="mb-3">However, we may share information when necessary with:</p>
                            <ul className="list-disc list-inside space-y-2 text-gray-400 ml-4 mb-4">
                                <li>Artists or their management teams for booking coordination</li>
                                <li>Event organizers or partners involved in service delivery</li>
                                <li>Service providers helping us operate the website or business operations</li>
                            </ul>
                            <p className="text-gray-400 italic">Information will only be shared to the extent necessary to provide services.</p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                                <span className="text-orange-500">4.</span> Data Security
                            </h2>
                            <p className="mb-3">We take reasonable technical and organizational measures to protect personal information from:</p>
                            <ul className="list-disc list-inside space-y-2 text-gray-400 ml-4 mb-4">
                                <li>Unauthorized access</li>
                                <li>Loss or misuse</li>
                                <li>Alteration or disclosure</li>
                            </ul>
                            <p className="text-gray-400 italic">However, no method of internet transmission or electronic storage is completely secure.</p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                                <span className="text-orange-500">5.</span> Cookies and Website Tracking
                            </h2>
                            <p className="mb-3">Our website may use cookies and similar tracking technologies to:</p>
                            <ul className="list-disc list-inside space-y-2 text-gray-400 ml-4 mb-4">
                                <li>Improve website functionality</li>
                                <li>Understand visitor behavior</li>
                                <li>Enhance user experience</li>
                            </ul>
                            <p className="text-gray-400">Users may choose to disable cookies through their browser settings.</p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                                <span className="text-orange-500">6.</span> Third-Party Links
                            </h2>
                            <p className="mb-2">Our website may contain links to third-party websites.</p>
                            <p className="text-gray-400">Artist Factory is not responsible for the privacy practices or content of those external websites. Users are encouraged to review their privacy policies.</p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                                <span className="text-orange-500">7.</span> Data Retention
                            </h2>
                            <p className="mb-3">We retain personal information only for as long as necessary to:</p>
                            <ul className="list-disc list-inside space-y-2 text-gray-400 ml-4">
                                <li>Provide our services</li>
                                <li>Respond to inquiries</li>
                                <li>Maintain business records</li>
                                <li>Comply with legal obligations</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                                <span className="text-orange-500">8.</span> Your Rights
                            </h2>
                            <p className="mb-3">Users may request to:</p>
                            <ul className="list-disc list-inside space-y-2 text-gray-400 ml-4 mb-4">
                                <li>Access their personal data</li>
                                <li>Correct inaccurate information</li>
                                <li>Request deletion of their personal data where applicable</li>
                            </ul>
                            <p className="text-gray-400">Requests may be made by contacting us directly.</p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                                <span className="text-orange-500">9.</span> Children's Privacy
                            </h2>
                            <p>Our website and services are not intended for individuals under the age of 18. We do not knowingly collect personal information from minors.</p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                                <span className="text-orange-500">10.</span> Updates to This Policy
                            </h2>
                            <p>Artist Factory reserves the right to update this Privacy Policy from time to time. Updated versions will be posted on this page.</p>
                        </section>

                        <section className="bg-[#1a1a1c] p-6 rounded-2xl border border-gray-800/80 mt-12">
                            <h2 className="text-xl font-bold text-white mb-4">11. Contact Information</h2>
                            <p className="text-gray-400 mb-2">If you have any questions regarding this Privacy Policy, please contact:</p>
                            <div className="text-white font-medium">
                                <p className="text-orange-400 font-bold text-lg mb-1">Artist Factory</p>
                                <p>Website: <a href="https://www.artistfactory.co" className="text-pink-400 hover:underline">www.artistfactory.co</a></p>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
}
