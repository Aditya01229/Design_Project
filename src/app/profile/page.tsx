"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode"; // Install via `npm install jwt-decode`

interface User {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  graduationYear?: string;
  language?: string;
  linkedin?: string;
  skills?: string;
  userType: "STUDENT" | "ALUMNI"; // Enum for user type
  company?: string; // Only for alumni
  location?: string; // Only for alumni
}

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [editableUser, setEditableUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
      return;
    }

    try {
      const decoded: { userId: string } = jwtDecode(token); // Extract userId from token

      fetch(`/api/user/${decoded.userId}`) // Fetch user details from backend
        .then((res) => res.json())
        .then((data) => {
          setUser(data);
          setEditableUser(data);
        })
        .catch((err) => console.error("Failed to fetch user:", err))
        .finally(() => setLoading(false));
    } catch (error) {
      console.error("Invalid token:", error);
      router.push("/login");
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!editableUser) return;
    setEditableUser({ ...editableUser, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    if (!editableUser) return;
    setSaving(true);

    try {
      const res = await fetch(`/api/user/${editableUser.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editableUser),
      });

      if (!res.ok) throw new Error("Failed to update profile");

      setUser(editableUser); // Update UI
    } catch (error) {
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <p className="text-center mt-10 text-gray-700">Loading...</p>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-blue-600 mb-4">Dashboard</h1>

      {/* Profile Overview */}
      <div className="bg-white shadow-md p-4 rounded-lg mb-6">
        <h2 className="text-xl font-semibold mb-2">Profile Overview</h2>

        {/* Common Fields */}
        <div className="mb-3">
          <p className="font-semibold">Name</p>
          <p className="text-gray-600">{user?.fullName}</p>
        </div>

        <div className="mb-3">
          <p className="font-semibold">Email</p>
          <p className="text-gray-600">{user?.email}</p>
        </div>

        <div className="mb-3">
          <label className="font-semibold">Phone</label>
          <input
            type="text"
            name="phone"
            value={editableUser?.phone || ""}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        <div className="mb-3">
          <label className="font-semibold">Graduation Year</label>
          <input
            type="text"
            name="graduationYear"
            value={editableUser?.graduationYear || ""}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        <div className="mb-3">
          <label className="font-semibold">Language</label>
          <input
            type="text"
            name="language"
            value={editableUser?.language || ""}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        <div className="mb-3">
          <label className="font-semibold">LinkedIn</label>
          <input
            type="text"
            name="linkedin"
            value={editableUser?.linkedin || ""}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        <div className="mb-3">
          <label className="font-semibold">Skills</label>
          <textarea
            name="skills"
            value={editableUser?.skills || ""}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Alumni Specific Fields */}
        {user?.userType === "ALUMNI" && (
          <>
            <div className="mb-3">
              <label className="font-semibold">Company</label>
              <input
                type="text"
                name="company"
                value={editableUser?.company || ""}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>

            <div className="mb-3">
              <label className="font-semibold">Location</label>
              <input
                type="text"
                name="location"
                value={editableUser?.location || ""}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>
          </>
        )}

        <button
          onClick={handleSave}
          className={`bg-blue-500 text-white px-4 py-2 rounded ${
            saving ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-600"
          }`}
          disabled={saving}
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
}
