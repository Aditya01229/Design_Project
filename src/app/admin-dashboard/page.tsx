/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import jwt from "jsonwebtoken";
import { X } from "lucide-react";

interface User {
  id: string;
  fullName: string;
  email: string;
  userType: string;
  phone: string;
}

export default function AdminManageUsers() {
  const router = useRouter();

  // --- Auth & Redirect ---
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return void router.push("/login");
    try {
      const decoded: any = jwt.decode(token);
      if (decoded.userType !== "ADMIN") router.push("/dashboard");
    } catch {
      router.push("/login");
    }
  }, [router]);

  // --- State: Users List ---
  const [users, setUsers] = useState<User[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [usersError, setUsersError] = useState<string | null>(null);

  // --- State: Event Form ---
  const [eventData, setEventData] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
    organizerId: "",
  });
  const [eventLoading, setEventLoading] = useState(false);
  const [eventError, setEventError] = useState<string | null>(null);

  // --- Modal Toggles ---
  const [showEventModal, setShowEventModal] = useState(false);
  const [showUsersModal, setShowUsersModal] = useState(false);

  // --- Fetch Users when opening user modal ---
  const fetchUsers = async () => {
    setUsersLoading(true);
    setUsersError(null);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/user", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) setUsers(data);
      else setUsersError(data.message || "Failed to fetch users");
    } catch {
      setUsersError("Unexpected error");
    } finally {
      setUsersLoading(false);
    }
  };
  useEffect(() => {
    if (showUsersModal) fetchUsers();
  }, [showUsersModal]);

  // --- Delete User ---
  const handleDeleteUser = async (id: string) => {
    if (!confirm("Delete this user?")) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/user/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) fetchUsers();
      else alert((await res.json()).message);
    } catch {
      alert("Unexpected error");
    }
  };

  // --- Event Form Handlers ---
  const handleEventChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setEventData({ ...eventData, [e.target.name]: e.target.value });
  };
  const submitEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    setEventLoading(true);
    setEventError(null);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(eventData),
      });
      if (res.ok) {
        setShowEventModal(false);
        setEventData({
          title: "",
          description: "",
          date: "",
          location: "",
          organizerId: "",
        });
      } else {
        setEventError((await res.json()).message);
      }
    } catch {
      setEventError("Unexpected error");
    } finally {
      setEventLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-4">
      {/* Buttons */}
      <button
        onClick={() => setShowEventModal(true)}
        className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
      >
        Add New Event
      </button>
      <button
        onClick={() => setShowUsersModal(true)}
        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
      >
        Manage Users
      </button>

      {/* Event Modal */}
      {showEventModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-40">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[80vh] overflow-y-auto relative shadow-xl">
            <button
              onClick={() => setShowEventModal(false)}
              className="absolute top-3 right-3 text-gray-600 hover:text-gray-900"
            >
              <X size={20} />
            </button>
            <h2 className="text-xl font-bold mb-4">Create New Event</h2>
            {eventError && <p className="text-red-500 mb-2">{eventError}</p>}
            <form onSubmit={submitEvent} className="space-y-3">
              <div>
                <label className="block text-sm">Title</label>
                <input
                  name="title"
                  value={eventData.title}
                  onChange={handleEventChange}
                  required
                  className="w-full border rounded p-2"
                />
              </div>
              <div>
                <label className="block text-sm">Description</label>
                <textarea
                  name="description"
                  value={eventData.description}
                  onChange={handleEventChange}
                  required
                  className="w-full border rounded p-2"
                />
              </div>
              <div>
                <label className="block text-sm">Date</label>
                <input
                  type="datetime-local"
                  name="date"
                  value={eventData.date}
                  onChange={handleEventChange}
                  required
                  className="w-full border rounded p-2"
                />
              </div>
              <div>
                <label className="block text-sm">Location</label>
                <input
                  name="location"
                  value={eventData.location}
                  onChange={handleEventChange}
                  required
                  className="w-full border rounded p-2"
                />
              </div>
              <div>
                <label className="block text-sm">Organizer ID</label>
                <input
                  name="organizerId"
                  value={eventData.organizerId}
                  onChange={handleEventChange}
                  required
                  className="w-full border rounded p-2"
                />
              </div>
              <div className="text-right">
                <button
                  type="submit"
                  disabled={eventLoading}
                  className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50"
                >
                  {eventLoading ? "Submitting…" : "Submit"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Users Modal */}
      {showUsersModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-40">
          <div className="bg-white rounded-lg p-6 w-full max-w-3xl max-h-[80vh] overflow-y-auto relative shadow-xl">
            <button
              onClick={() => setShowUsersModal(false)}
              className="absolute top-3 right-3 text-gray-600 hover:text-gray-900"
            >
              <X size={20} />
            </button>
            <h2 className="text-xl font-bold mb-4">All Users</h2>
            {usersError && <p className="text-red-500 mb-2">{usersError}</p>}
            {usersLoading ? (
              <p>Loading users…</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full table-auto border-collapse">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="px-4 py-2 text-left">Name</th>
                      <th className="px-4 py-2 text-left">Email</th>
                      <th className="px-4 py-2 text-left">Type</th>
                      <th className="px-4 py-2 text-left">Phone</th>
                      <th className="px-4 py-2 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u.id} className="border-t">
                        <td className="px-4 py-2">{u.fullName}</td>
                        <td className="px-4 py-2">{u.email}</td>
                        <td className="px-4 py-2">{u.userType}</td>
                        <td className="px-4 py-2">{u.phone}</td>
                        <td className="px-4 py-2 space-x-2">
                          <button
                            onClick={() =>
                              router.push(`/admin/manage/users/${u.id}`)
                            }
                            className="inline-flex items-center px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                          >
                            View/Edit
                          </button>
                          <button
                            onClick={() => handleDeleteUser(u.id)}
                            className="inline-flex items-center px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
