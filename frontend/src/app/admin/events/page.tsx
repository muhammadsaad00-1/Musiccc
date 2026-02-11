"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  ArrowLeft,
  Loader2,
  X,
  Upload,
} from "lucide-react";

export default function ManageEventsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [events, setEvents] = useState<any[]>([]);
  const [performers, setPerformers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    event_recommendations: "",
    pricing: "",
    performer_ids: [] as string[],
  });
  const [headerImage, setHeaderImage] = useState<File | null>(null);

  useEffect(() => {
    fetchEvents();
    fetchPerformers();
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://127.0.0.1:8000/events");
      const data = await response.json();
      setEvents(data);
    } catch (error) {
      console.error("Failed to fetch events:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPerformers = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/performers");
      const data = await response.json();
      setPerformers(data);
    } catch (error) {
      console.error("Failed to fetch performers:", error);
    }
  };

  const filteredEvents = events.filter((event) =>
    event.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this event?")) return;

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/admin/events/${id}`,
        {
          method: "DELETE",
        },
      );

      if (response.ok) {
        setEvents(events.filter((e) => e.id !== id));
      } else {
        alert("Failed to delete event");
      }
    } catch (error) {
      console.error("Failed to delete event:", error);
      alert("Failed to delete event");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const formDataToSend = new FormData();

      // Add text fields
      formDataToSend.append("name", formData.name);
      formDataToSend.append("description", formData.description);
      formDataToSend.append(
        "event_recommendations",
        formData.event_recommendations,
      );
      if (formData.pricing)
        formDataToSend.append("pricing", formData.pricing);

      // Add performer IDs as JSON string
      formDataToSend.append(
        "performer_ids",
        JSON.stringify(formData.performer_ids),
      );

      // Add header image
      if (headerImage) {
        formDataToSend.append("image", headerImage);
      }

      const url = showEditModal
        ? `http://127.0.0.1:8000/admin/events/${selectedEvent.id}`
        : "http://127.0.0.1:8000/admin/events";

      const method = showEditModal ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        body: formDataToSend,
      });

      if (response.ok) {
        await fetchEvents();
        resetForm();
        setShowAddModal(false);
        setShowEditModal(false);
      } else {
        alert("Failed to save event");
      }
    } catch (error) {
      console.error("Failed to save event:", error);
      alert("Failed to save event");
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      event_recommendations: "",
      pricing: "",
      performer_ids: [],
    });
    setHeaderImage(null);
    setSelectedEvent(null);
  };

  const handleEdit = (event: any) => {
    setSelectedEvent(event);
    setFormData({
      name: event.name || "",
      description: event.description || "",
      event_recommendations: event.event_recommendations || "",
      pricing: event.pricing?.toString() || "",
      performer_ids: event.performer_ids || [],
    });
    setShowEditModal(true);
  };

  const togglePerformer = (performerId: string) => {
    setFormData((prev) => ({
      ...prev,
      performer_ids: prev.performer_ids.includes(performerId)
        ? prev.performer_ids.filter((id) => id !== performerId)
        : [...prev.performer_ids, performerId],
    }));
  };

  return (
    <div className="min-h-screen bg-[#0a0a0b]">
      {/* Header */}
      <header className="bg-[#1a1a1a] border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="text-gray-400 hover:text-white">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-2xl font-bold text-white">Manage Events</h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              placeholder="Search events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-[#1a1a1a] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center justify-center gap-2 px-6 py-2.5 bg-gradient-to-r from-orange-500 to-pink-600 text-white font-medium rounded-lg hover:shadow-lg hover:shadow-pink-500/30 transition-all"
          >
            <Plus className="w-5 h-5" />
            Add Event
          </button>
        </div>

        {/* Events Table */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
          </div>
        ) : (
          <div className="bg-[#1a1a1a] rounded-xl border border-gray-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#0f0f10]">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Event
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Pricing
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Performers
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {filteredEvents.map((event) => {
                    return (
                      <tr key={event.id} className="hover:bg-[#2a2a2a]">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <img
                              src={
                                event.header_image_url || "/placeholder.png"
                              }
                              alt={event.name}
                              className="w-10 h-10 rounded-lg object-cover"
                            />
                            <div className="ml-4">
                              <div className="text-sm font-medium text-white">
                                {event.name}
                              </div>
                              <div className="text-sm text-gray-500">
                                ID: {event.id.slice(0, 8)}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 max-w-xs">
                          <div className="text-sm text-gray-400 truncate">
                            {event.description || "-"}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                          {event.pricing
                            ? `PKR ${event.pricing.toLocaleString()}`
                            : "-"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                          {event.performers?.length || 0} assigned
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 text-xs font-medium bg-green-500/20 text-green-400 rounded-full">
                            Active
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => handleEdit(event)}
                              className="p-2 text-gray-400 hover:text-orange-400 hover:bg-[#2a2a2a] rounded-lg transition-colors"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(event.id)}
                              className="p-2 text-gray-400 hover:text-red-400 hover:bg-[#2a2a2a] rounded-lg transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {filteredEvents.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">No events found</p>
              </div>
            )}
          </div>
        )}

        {/* Add/Edit Modal */}
        {(showAddModal || showEditModal) && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-[#1a1a1a] rounded-2xl border border-gray-800 max-w-3xl w-full my-8">
              <div className="flex items-center justify-between p-6 border-b border-gray-800">
                <h2 className="text-xl font-bold text-white">
                  {showEditModal ? "Edit Event" : "Add New Event"}
                </h2>
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setShowEditModal(false);
                    resetForm();
                  }}
                  className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Event Name <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="w-full px-4 py-2 bg-[#0a0a0b] border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Pricing (PKR)
                    </label>
                    <input
                      type="number"
                      value={formData.pricing}
                      onChange={(e) =>
                        setFormData({ ...formData, pricing: e.target.value })
                      }
                      className="w-full px-4 py-2 bg-[#0a0a0b] border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Description
                  </label>
                  <textarea
                    rows={4}
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="w-full px-4 py-2 bg-[#0a0a0b] border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Event Recommendations
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Recommended for weddings, corporate events, etc."
                    value={formData.event_recommendations}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        event_recommendations: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 bg-[#0a0a0b] border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Assign Performers
                  </label>
                  <div className="bg-[#0a0a0b] border border-gray-700 rounded-lg p-4 max-h-60 overflow-y-auto">
                    {performers.length === 0 ? (
                      <p className="text-gray-500 text-sm">
                        No performers available
                      </p>
                    ) : (
                      <div className="space-y-2">
                        {performers.map((performer) => (
                          <label
                            key={performer.id}
                            className="flex items-center gap-3 p-2 hover:bg-[#1a1a1a] rounded-lg cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              checked={formData.performer_ids.includes(
                                performer.id,
                              )}
                              onChange={() => togglePerformer(performer.id)}
                              className="w-4 h-4 text-orange-500 bg-gray-700 border-gray-600 rounded focus:ring-orange-500 focus:ring-2"
                            />
                            <img
                              src={
                                performer.profile_image_url ||
                                "/placeholder.png"
                              }
                              alt={performer.name}
                              className="w-8 h-8 rounded-full object-cover"
                            />
                            <div className="flex-1">
                              <div className="text-sm text-white">
                                {performer.name}
                              </div>
                              <div className="text-xs text-gray-500">
                                {performer.category}
                              </div>
                            </div>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    {formData.performer_ids.length} performer(s) selected
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Header Image{" "}
                    {!showEditModal && <span className="text-red-400">*</span>}
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    required={!showEditModal}
                    onChange={(e) =>
                      setHeaderImage(e.target.files?.[0] || null)
                    }
                    className="w-full px-4 py-2 bg-[#0a0a0b] border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-800">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddModal(false);
                      setShowEditModal(false);
                      resetForm();
                    }}
                    className="px-6 py-2.5 bg-gray-800 text-gray-300 font-medium rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-pink-600 text-white font-medium rounded-lg hover:shadow-lg hover:shadow-pink-500/30 transition-all disabled:opacity-50 flex items-center gap-2"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Saving...
                      </>
                    ) : showEditModal ? (
                      "Update Event"
                    ) : (
                      "Add Event"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
