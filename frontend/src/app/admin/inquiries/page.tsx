"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Music,
  DollarSign,
  User,
  Mail,
  Phone,
  MessageSquare,
  Clock,
  CheckCircle,
  XCircle,
  Loader2,
  Filter,
  RefreshCw,
  Eye,
  X,
  MessageCircle,
} from "lucide-react";

interface Requirement {
  id: string;
  event_name: string;
  event_type: string;
  event_date: string;
  event_location: string;
  budget: string;
  artist_type: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  message: string;
  status: "pending" | "contacted" | "booked" | "cancelled";
  created_at: string;
}

const statusConfig = {
  pending: {
    label: "Pending",
    color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    icon: Clock,
  },
  contacted: {
    label: "Contacted",
    color: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    icon: Phone,
  },
  booked: {
    label: "Booked",
    color: "bg-green-500/20 text-green-400 border-green-500/30",
    icon: CheckCircle,
  },
  cancelled: {
    label: "Cancelled",
    color: "bg-red-500/20 text-red-400 border-red-500/30",
    icon: XCircle,
  },
};

export default function InquiriesPage() {
  const [requirements, setRequirements] = useState<Requirement[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");
  const [selectedRequirement, setSelectedRequirement] =
    useState<Requirement | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);

  const fetchRequirements = async () => {
    setLoading(true);
    try {
      const url =
        filter === "all"
          ? "http://127.0.0.1:8000/api/requirements"
          : `http://127.0.0.1:8000/api/requirements?status=${filter}`;
      const response = await fetch(url);
      const data = await response.json();
      setRequirements(data);
    } catch (error) {
      console.error("Failed to fetch requirements:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequirements();
  }, [filter]);

  const updateStatus = async (id: string, newStatus: string) => {
    setUpdatingStatus(id);
    try {
      const formData = new FormData();
      formData.append("status", newStatus);

      const response = await fetch(
        `http://127.0.0.1:8000/api/requirements/${id}/status`,
        {
          method: "PUT",
          body: formData,
        },
      );

      if (response.ok) {
        // Update local state
        setRequirements((prev) =>
          prev.map((req) =>
            req.id === id ? { ...req, status: newStatus as any } : req,
          ),
        );
        if (selectedRequirement?.id === id) {
          setSelectedRequirement({
            ...selectedRequirement,
            status: newStatus as any,
          });
        }
      }
    } catch (error) {
      console.error("Failed to update status:", error);
    } finally {
      setUpdatingStatus(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatBudget = (budget: string) => {
    if (!budget) return "Not specified";
    return budget.replace("-", " - ").replace("k", "K").toUpperCase();
  };

  const formatPhoneForWhatsApp = (phone: string) => {
    // Remove all non-numeric characters
    const cleanPhone = phone.replace(/[^0-9]/g, '');

    // If it already starts with 92, return as is
    if (cleanPhone.startsWith('92')) {
      return cleanPhone;
    }

    // If it starts with 0, replace with 92
    if (cleanPhone.startsWith('0')) {
      return '92' + cleanPhone.substring(1);
    }

    // Otherwise, add 92 at the beginning
    return '92' + cleanPhone;
  };

  const generateWhatsAppMessage = (req: Requirement) => {
    const eventDate = formatDate(req.event_date);
    const budget = formatBudget(req.budget);

    return `Hello ${req.customer_name},

Thank you for your booking inquiry!

*Event Details:*
• Event Type: ${req.event_type}
• Date: ${eventDate}
• Location: ${req.event_location}
• Artist Type: ${req.artist_type}
• Budget: ${budget}

We're reviewing your request and will get back to you with availability and pricing details shortly.

How can we assist you further?`;

  };

  return (
    <div className="min-h-screen bg-[#0a0a0b]">
      {/* Header */}
      <header className="bg-[#1a1a1a] border-b border-gray-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/admin"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-white">
                  Booking Inquiries
                </h1>
                <p className="text-sm text-gray-500">
                  Manage customer booking requests
                </p>
              </div>
            </div>
            <button
              onClick={fetchRequirements}
              className="flex items-center gap-2 px-4 py-2 bg-[#2a2a2a] text-gray-300 rounded-lg hover:bg-[#333] transition-colors"
            >
              <RefreshCw
                className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
              />
              Refresh
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="flex items-center gap-3 mb-6 flex-wrap">
          <div className="flex items-center gap-2 text-gray-400">
            <Filter className="w-4 h-4" />
            <span className="text-sm">Filter:</span>
          </div>
          {["all", "pending", "contacted", "booked", "cancelled"].map(
            (status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filter === status
                  ? "bg-gradient-to-r from-orange-500 to-pink-600 text-white shadow-lg shadow-orange-500/20"
                  : "bg-[#1a1a1a] text-gray-400 hover:text-white border border-gray-800"
                  }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
                {status !== "all" && (
                  <span className="ml-2 px-2 py-0.5 bg-black/20 rounded-full text-xs">
                    {requirements.filter((r) => r.status === status).length}
                  </span>
                )}
              </button>
            ),
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {Object.entries(statusConfig).map(([status, config]) => {
            const StatusIcon = config.icon;
            const count = requirements.filter(
              (r) => r.status === status,
            ).length;
            return (
              <div
                key={status}
                className={`p-4 rounded-xl border ${config.color} cursor-pointer hover:scale-105 transition-transform`}
                onClick={() => setFilter(status)}
              >
                <div className="flex items-center justify-between mb-2">
                  <StatusIcon className="w-5 h-5" />
                  <span className="text-2xl font-bold">{count}</span>
                </div>
                <p className="text-sm opacity-80">{config.label}</p>
              </div>
            );
          })}
        </div>

        {/* Requirements List */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
          </div>
        ) : requirements.length === 0 ? (
          <div className="text-center py-20">
            <MessageSquare className="w-16 h-16 text-gray-700 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">
              No Inquiries Yet
            </h3>
            <p className="text-gray-500">
              Booking requests will appear here when customers submit them.
            </p>
          </div>
        ) : (
          <div className="bg-[#1a1a1a] rounded-xl border border-gray-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#0f0f10]">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Event
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Artist
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Budget
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {requirements.map((req) => {
                    const StatusIcon = statusConfig[req.status]?.icon || Clock;
                    return (
                      <tr
                        key={req.id}
                        className="hover:bg-[#222] transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-medium text-white">
                              {req.customer_name}
                            </p>
                            <p className="text-sm text-gray-500">
                              {req.customer_phone}
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <p className="text-white">{req.event_type}</p>
                            <p className="text-sm text-gray-500 flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {req.event_location}
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="capitalize text-gray-300">
                            {req.artist_type}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-gray-300">
                            {formatBudget(req.budget)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${statusConfig[req.status]?.color || ""}`}
                          >
                            <StatusIcon className="w-3 h-3" />
                            {statusConfig[req.status]?.label || req.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <p className="text-white">
                              {formatDate(req.event_date)}
                            </p>
                            <p className="text-xs text-gray-500">
                              Received: {formatDate(req.created_at)}
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <a
                            href={`https://wa.me/${formatPhoneForWhatsApp(req.customer_phone)}?text=${encodeURIComponent(generateWhatsAppMessage(req))}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#0a0a0b] border border-green-500/50 text-green-400 text-xs font-medium rounded-lg transition-all hover:border-green-400 hover:shadow-[0_0_12px_rgba(34,197,94,0.3)] hover:text-green-300"
                            title="Contact on WhatsApp"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                            WhatsApp
                          </a>
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => setSelectedRequirement(req)}
                            className="flex items-center gap-1 text-orange-400 hover:text-orange-300 font-medium text-sm transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                            View
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* Detail Modal */}
      {selectedRequirement && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#1a1a1a] rounded-2xl border border-gray-800 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-800">
              <div>
                <h2 className="text-xl font-bold text-white">
                  Booking Request Details
                </h2>
                <p className="text-sm text-gray-500">
                  ID: {selectedRequirement.id}
                </p>
              </div>
              <button
                onClick={() => setSelectedRequirement(null)}
                className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Status Badge */}
              <div className="flex items-center justify-between">
                <span
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-medium border ${statusConfig[selectedRequirement.status]?.color || ""}`}
                >
                  {(() => {
                    const Icon =
                      statusConfig[selectedRequirement.status]?.icon || Clock;
                    return <Icon className="w-4 h-4" />;
                  })()}
                  {statusConfig[selectedRequirement.status]?.label ||
                    selectedRequirement.status}
                </span>
                <span className="text-sm text-gray-500">
                  Submitted: {formatDateTime(selectedRequirement.created_at)}
                </span>
              </div>

              {/* Customer Info */}
              <div className="bg-[#0f0f10] rounded-xl p-5 border border-gray-800">
                <h3 className="text-sm font-medium text-orange-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Customer Information
                </h3>
                <div className="grid gap-3">
                  <div className="flex items-center gap-3">
                    <User className="w-4 h-4 text-gray-500" />
                    <span className="text-white">
                      {selectedRequirement.customer_name}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <a
                      href={`mailto:${selectedRequirement.customer_email}`}
                      className="text-blue-400 hover:underline"
                    >
                      {selectedRequirement.customer_email}
                    </a>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <a
                      href={`tel:${selectedRequirement.customer_phone}`}
                      className="text-blue-400 hover:underline"
                    >
                      {selectedRequirement.customer_phone}
                    </a>
                  </div>
                </div>
              </div>

              {/* Event Details */}
              <div className="bg-[#0f0f10] rounded-xl p-5 border border-gray-800">
                <h3 className="text-sm font-medium text-orange-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Event Details
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Package Name</p>
                    <p className="text-orange-400 font-medium">
                      {selectedRequirement.event_name || "Custom"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Event Type</p>
                    <p className="text-white font-medium">
                      {selectedRequirement.event_type}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Event Date</p>
                    <p className="text-white font-medium">
                      {formatDate(selectedRequirement.event_date)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Location</p>
                    <p className="text-white font-medium">
                      {selectedRequirement.event_location}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Artist Type</p>
                    <p className="text-white font-medium capitalize">
                      {selectedRequirement.artist_type}
                    </p>
                  </div>
                </div>
              </div>

              {/* Budget & Notes */}
              <div className="bg-[#0f0f10] rounded-xl p-5 border border-gray-800">
                <h3 className="text-sm font-medium text-orange-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  Budget & Notes
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Budget Range</p>
                    <p className="text-white font-medium">
                      {formatBudget(selectedRequirement.budget)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">
                      Additional Notes
                    </p>
                    {selectedRequirement.message ? (
                      <p className="text-gray-300 italic">
                        {selectedRequirement.message}
                      </p>
                    ) : (
                      <p className="text-gray-600 italic">
                        No additional message provided
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Status Update */}
              <div>
                <h3 className="text-sm font-medium text-gray-400 mb-3">
                  Update Status
                </h3>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(statusConfig).map(([status, config]) => {
                    const StatusIcon = config.icon;
                    const isActive = selectedRequirement.status === status;
                    const isUpdating =
                      updatingStatus === selectedRequirement.id;

                    return (
                      <button
                        key={status}
                        onClick={() =>
                          updateStatus(selectedRequirement.id, status)
                        }
                        disabled={isActive || isUpdating}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${isActive
                          ? `${config.color} cursor-default`
                          : "border-gray-700 text-gray-400 hover:text-white hover:border-gray-600"
                          } disabled:opacity-50`}
                      >
                        {isUpdating ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <StatusIcon className="w-4 h-4" />
                        )}
                        {config.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-800">
              <a
                href={`https://wa.me/${formatPhoneForWhatsApp(selectedRequirement.customer_phone)}?text=${encodeURIComponent(generateWhatsAppMessage(selectedRequirement))}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 py-2.5 bg-[#0a0a0b] border border-green-500/50 text-green-400 font-medium rounded-lg transition-all hover:border-green-400 hover:shadow-[0_0_16px_rgba(34,197,94,0.35)] hover:text-green-300"
              >
                <MessageCircle className="w-4 h-4" />
                Contact on WhatsApp
              </a>
              <a
                href={`mailto:${selectedRequirement.customer_email}?subject=Re: Your Booking Request for ${selectedRequirement.event_type}`}
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-medium rounded-lg hover:shadow-lg hover:shadow-blue-500/20 transition-all"
              >
                <Mail className="w-4 h-4" />
                Send Email
              </a>
              <button
                onClick={() => setSelectedRequirement(null)}
                className="px-5 py-2.5 bg-gray-800 text-gray-300 font-medium rounded-lg hover:bg-gray-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
