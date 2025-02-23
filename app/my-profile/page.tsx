"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function MyProfile() {
  const router = useRouter();
  const [profile, setProfile] = useState({
    full_name: "",
    phone: "",
    email: "",
    country_of_residence: "",
    city: "",
    college: "",
    immigration_country: "",
    purpose: "",
    exam_slot_booked: false,
    exam_slot_date: "",
    marketing_opt_in: false,
    referral_code: "",
    preferred_exam_type: "Academic",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Fetch the profile data on mount
  useEffect(() => {
    async function fetchProfile() {
      setLoading(true);
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData?.session) {
        setMessage("You must be logged in to view your profile.");
        setLoading(false);
        return;
      }
      const token = sessionData.session.access_token;
      try {
        const res = await fetch("/api/user_profile", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (!data.error) {
          setProfile(data);
        } else {
          setMessage(data.error);
        }
      } catch (error) {
        setMessage("Error fetching profile.");
      }
      setLoading(false);
    }
    fetchProfile();
  }, []);

  // Update profile state when any field changes
  const handleChange = (field: string, value: any) => {
    setProfile((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Call the API to update the profile when the user clicks Save Changes
  const handleSave = async () => {
    setLoading(true);
    setMessage("");
    const { data: sessionData } = await supabase.auth.getSession();
    if (!sessionData?.session) {
      setMessage("You must be logged in to update your profile.");
      setLoading(false);
      return;
    }
    const token = sessionData.session.access_token;
    try {
      const res = await fetch("/api/user_profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(profile),
      });
      const data = await res.json();
      if (!data.error) {
        setMessage("Profile updated successfully!");
      } else {
        setMessage(data.error);
      }
    } catch (error) {
      setMessage("Error updating profile.");
    }
    setLoading(false);
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 text-gray-800">
        Loading...
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-2xl w-full bg-white p-8 rounded shadow-md">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">My Profile</h1>
        {message && <p className="mb-4 text-red-600">{message}</p>}

        <div className="grid grid-cols-1 gap-4">
          {/* Full Name */}
          <label className="block">
            <span className="text-gray-900 font-semibold">Full Name</span>
            <input
              type="text"
              value={profile.full_name}
              onChange={(e) => handleChange("full_name", e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded text-gray-800
                         focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors"
            />
          </label>
          {/* Phone */}
          <label className="block">
            <span className="text-gray-900 font-semibold">Phone</span>
            <input
              type="text"
              value={profile.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded text-gray-800
                         focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors"
            />
          </label>
          {/* Email */}
          <label className="block">
            <span className="text-gray-900 font-semibold">Email</span>
            <input
              type="email"
              value={profile.email}
              onChange={(e) => handleChange("email", e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded text-gray-800
                         focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors"
            />
          </label>
          {/* Country of Residence */}
          <label className="block">
            <span className="text-gray-900 font-semibold">Country of Residence</span>
            <input
              type="text"
              value={profile.country_of_residence}
              onChange={(e) => handleChange("country_of_residence", e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded text-gray-800
                         focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors"
            />
          </label>
          {/* City */}
          <label className="block">
            <span className="text-gray-900 font-semibold">City</span>
            <input
              type="text"
              value={profile.city}
              onChange={(e) => handleChange("city", e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded text-gray-800
                         focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors"
            />
          </label>
          {/* College */}
          <label className="block">
            <span className="text-gray-900 font-semibold">College</span>
            <input
              type="text"
              value={profile.college}
              onChange={(e) => handleChange("college", e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded text-gray-800
                         focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors"
            />
          </label>
          {/* Immigration Country */}
          <label className="block">
            <span className="text-gray-900 font-semibold">
              Which country are you immigrating to?
            </span>
            <input
              type="text"
              value={profile.immigration_country}
              onChange={(e) => handleChange("immigration_country", e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded text-gray-800
                         focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors"
            />
          </label>
          {/* Purpose */}
          <label className="block">
            <span className="text-gray-900 font-semibold">Purpose (e.g., Study, Immigration...)</span>
            <input
              type="text"
              value={profile.purpose}
              onChange={(e) => handleChange("purpose", e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded text-gray-800
                         focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors"
            />
          </label>
          {/* Did you book exam? */}
          <div className="block">
            <span className="text-gray-900 font-semibold">Did you book exam?</span>
            <div className="mt-1 flex gap-6">
              <label className="flex items-center gap-2 text-gray-800">
                <input
                  type="radio"
                  name="examBooked"
                  value="true"
                  checked={profile.exam_slot_booked === true}
                  onChange={() => handleChange("exam_slot_booked", true)}
                />
                Yes
              </label>
              <label className="flex items-center gap-2 text-gray-800">
                <input
                  type="radio"
                  name="examBooked"
                  value="false"
                  checked={profile.exam_slot_booked === false}
                  onChange={() => handleChange("exam_slot_booked", false)}
                />
                No
              </label>
            </div>
          </div>
          {/* Exam Slot Date */}
          <label className="block">
            <span className="text-gray-900 font-semibold">Exam Slot Date (Optional)</span>
            <input
              type="datetime-local"
              value={profile.exam_slot_date}
              onChange={(e) => handleChange("exam_slot_date", e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded text-gray-800
                         focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors"
            />
          </label>
          {/* Marketing Opt-In */}
          <label className="block flex items-center gap-2 mt-1 text-gray-800">
            <input
              type="checkbox"
              checked={profile.marketing_opt_in}
              onChange={(e) => handleChange("marketing_opt_in", e.target.checked)}
              className="focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors"
            />
            <span className="font-semibold">Receive Marketing Updates?</span>
          </label>
          {/* Referral Code */}
          <label className="block">
            <span className="text-gray-900 font-semibold">Referral Code</span>
            <input
              type="text"
              value={profile.referral_code}
              onChange={(e) => handleChange("referral_code", e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded text-gray-800
                         focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors"
            />
          </label>
          {/* Preferred Exam Type */}
          <div className="block">
            <span className="text-gray-900 font-semibold">Preparing for - Exam Type</span>
            <div className="mt-1 flex gap-6">
              <label className="flex items-center gap-2 text-gray-800">
                <input
                  type="radio"
                  name="preferredExamType"
                  value="Academic"
                  checked={profile.preferred_exam_type === "Academic"}
                  onChange={(e) => handleChange("preferred_exam_type", e.target.value)}
                />
                Academic
              </label>
              <label className="flex items-center gap-2 text-gray-800">
                <input
                  type="radio"
                  name="preferredExamType"
                  value="General"
                  checked={profile.preferred_exam_type === "General"}
                  onChange={(e) => handleChange("preferred_exam_type", e.target.value)}
                />
                General
              </label>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={handleSave}
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700
                       focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
