"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Loader2, UserCircle2, Upload } from "lucide-react";
import { API_BASE_URL } from "@/lib/api";

interface AboutProfile {
  founder_name: string;
  founder_title: string;
  founder_bio: string;
  instagram_url: string;
  primary_cta_text: string;
  primary_cta_link: string;
  secondary_cta_text: string;
  secondary_cta_link: string;
  image_url?: string;
}

const defaultProfile: AboutProfile = {
  founder_name: "Abubakar Javed",
  founder_title: "Founder, The Artist Factory",
  founder_bio: "",
  instagram_url: "https://www.instagram.com/theartistfactoryofficial",
  primary_cta_text: "Book Artists",
  primary_cta_link: "/artists",
  secondary_cta_text: "Request a Custom Event Proposal",
  secondary_cta_link: "/post-requirement",
  image_url: "",
};

export default function AdminAboutPage() {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);

  const [profile, setProfile] = useState<AboutProfile>(defaultProfile);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string>("");
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const isLoggedIn = sessionStorage.getItem("adminLoggedIn");
    const accessToken = sessionStorage.getItem("adminAccessToken");
    if (isLoggedIn !== "true" || !accessToken) {
      router.push("/admin/login");
      return;
    }

    const load = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/about-profile`);
        if (res.ok) {
          const data = await res.json();
          if (data) {
            setProfile({
              ...defaultProfile,
              ...data,
              founder_name: data.founder_name || defaultProfile.founder_name,
              founder_title: data.founder_title || defaultProfile.founder_title,
              founder_bio: data.founder_bio || defaultProfile.founder_bio,
            });
            if (data.image_url) setPreviewUrl(data.image_url);
          }
        }
      } catch (e) {
        console.error("Failed to load about profile", e);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [router]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setPhotoFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");

    try {
      const form = new FormData();
      form.append("founder_name", profile.founder_name);
      form.append("founder_title", profile.founder_title);
      form.append("founder_bio", profile.founder_bio);
      form.append("instagram_url", profile.instagram_url);
      form.append("primary_cta_text", profile.primary_cta_text);
      form.append("primary_cta_link", profile.primary_cta_link);
      form.append("secondary_cta_text", profile.secondary_cta_text);
      form.append("secondary_cta_link", profile.secondary_cta_link);
      if (photoFile) {
        form.append("image", photoFile);
      }

      const res = await fetch(`${API_BASE_URL}/api/admin/about-profile`, {
        method: "PUT",
        body: form,
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.message || "Failed to save profile");
      } else {
        setMessage("About profile updated successfully.");
        if (data.data?.image_url) {
          setPreviewUrl(data.data.image_url);
        }
        setPhotoFile(null);
      }
    } catch (e) {
      console.error(e);
      setError("Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0b] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0b]">
      <header className="bg-[#1a1a1a] border-b border-gray-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-4">
          <Link href="/admin" className="text-gray-400 hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-xl md:text-2xl font-bold text-white">Edit About Profile</h1>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSave} className="bg-[#1a1a1a] border border-gray-800 rounded-2xl p-6 md:p-8 space-y-6">
          <div className="grid md:grid-cols-[220px,1fr] gap-6">
            <div>
              <p className="text-sm text-gray-400 mb-3">Profile Photo</p>
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="w-full border border-dashed border-gray-700 hover:border-orange-500/50 rounded-2xl p-4 bg-[#0f0f10] transition-colors"
              >
                {previewUrl ? (
                  <div className="relative w-full aspect-square rounded-xl overflow-hidden">
                    <Image src={previewUrl} alt="Founder preview" fill className="object-cover" />
                  </div>
                ) : (
                  <div className="aspect-square rounded-xl bg-gray-900 flex flex-col items-center justify-center gap-2 text-gray-500">
                    <UserCircle2 className="w-12 h-12" />
                    <span className="text-xs">Upload founder image</span>
                  </div>
                )}
                <span className="mt-3 inline-flex items-center gap-2 text-sm text-orange-400">
                  <Upload className="w-4 h-4" /> Change Photo
                </span>
              </button>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Founder Name</label>
                <input
                  value={profile.founder_name}
                  onChange={(e) => setProfile((p) => ({ ...p, founder_name: e.target.value }))}
                  className="w-full bg-[#0f0f10] border border-gray-700 rounded-xl px-4 py-3 text-white"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Founder Title</label>
                <input
                  value={profile.founder_title}
                  onChange={(e) => setProfile((p) => ({ ...p, founder_title: e.target.value }))}
                  className="w-full bg-[#0f0f10] border border-gray-700 rounded-xl px-4 py-3 text-white"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Bio</label>
                <textarea
                  rows={7}
                  value={profile.founder_bio}
                  onChange={(e) => setProfile((p) => ({ ...p, founder_bio: e.target.value }))}
                  className="w-full bg-[#0f0f10] border border-gray-700 rounded-xl px-4 py-3 text-white resize-y"
                  placeholder="Use blank lines to create separate paragraphs."
                />
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Instagram URL</label>
              <input
                value={profile.instagram_url}
                onChange={(e) => setProfile((p) => ({ ...p, instagram_url: e.target.value }))}
                className="w-full bg-[#0f0f10] border border-gray-700 rounded-xl px-4 py-3 text-white"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Primary CTA Text</label>
              <input
                value={profile.primary_cta_text}
                onChange={(e) => setProfile((p) => ({ ...p, primary_cta_text: e.target.value }))}
                className="w-full bg-[#0f0f10] border border-gray-700 rounded-xl px-4 py-3 text-white"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Primary CTA Link</label>
              <input
                value={profile.primary_cta_link}
                onChange={(e) => setProfile((p) => ({ ...p, primary_cta_link: e.target.value }))}
                className="w-full bg-[#0f0f10] border border-gray-700 rounded-xl px-4 py-3 text-white"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Secondary CTA Text</label>
              <input
                value={profile.secondary_cta_text}
                onChange={(e) => setProfile((p) => ({ ...p, secondary_cta_text: e.target.value }))}
                className="w-full bg-[#0f0f10] border border-gray-700 rounded-xl px-4 py-3 text-white"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm text-gray-400 mb-1">Secondary CTA Link</label>
              <input
                value={profile.secondary_cta_link}
                onChange={(e) => setProfile((p) => ({ ...p, secondary_cta_link: e.target.value }))}
                className="w-full bg-[#0f0f10] border border-gray-700 rounded-xl px-4 py-3 text-white"
              />
            </div>
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}
          {message && <p className="text-sm text-green-400">{message}</p>}

          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-pink-600 text-white font-semibold disabled:opacity-60"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save About Profile
          </button>
        </form>
      </main>
    </div>
  );
}
