"use client"
import { useState, useEffect } from "react"
import type React from "react"

import { useRouter } from "next/navigation"
import jwt from "jsonwebtoken"

interface User {
  id: string
  fullName: string
  email: string
  userType: string
  phone: string
}

export default function AdminManageUsers() {
  const router = useRouter()

  // --- Auth & Redirect ---
  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) return void router.push("/login")
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const decoded: any = jwt.decode(token)
      if (decoded.userType !== "ADMIN") router.push("/dashboard")
    } catch {
      router.push("/login")
    }
  }, [router])

  // --- State: Users List ---
  const [users, setUsers] = useState<User[]>([])
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [usersLoading, setUsersLoading] = useState(false)
  const [usersError, setUsersError] = useState<string | null>(null)

  // --- State: Event Form ---
  const [eventData, setEventData] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
  })
  const [eventLoading, setEventLoading] = useState(false)
  const [eventError, setEventError] = useState<string | null>(null)

  // --- Tab State ---
  const [activeTab, setActiveTab] = useState("users")

  // --- Toast State ---
  const [toast, setToast] = useState<{ visible: boolean; message: string; type: "success" | "error" } | null>(null)

  // Show toast message
  const showToast = (message: string, type: "success" | "error") => {
    setToast({ visible: true, message, type })
    setTimeout(() => setToast(null), 3000)
  }

  // --- Fetch Users ---
  const fetchUsers = async () => {
    setUsersLoading(true)
    setUsersError(null)
    try {
      const token = localStorage.getItem("token")
      const res = await fetch("/api/user", {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      if (res.ok) {
        setUsers(data)
        setFilteredUsers(data)
      } else setUsersError(data.message || "Failed to fetch users")
    } catch {
      setUsersError("Unexpected error")
    } finally {
      setUsersLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  // Filter users when search term changes
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredUsers(users)
    } else {
      const filtered = users.filter(
        (user) =>
          user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.userType.toLowerCase().includes(searchTerm.toLowerCase()),
      )
      setFilteredUsers(filtered)
    }
  }, [searchTerm, users])

  // --- Delete User ---
  const handleDeleteUser = async (id: string) => {
    try {
      const token = localStorage.getItem("token")
      const res = await fetch(`/api/user/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      })

      if (res.ok) {
        showToast("User deleted successfully", "success")
        fetchUsers()
      } else {
        const data = await res.json()
        showToast(data.message || "Failed to delete user", "error")
      }
    } catch {
      showToast("An unexpected error occurred", "error")
    }
  }

  // --- Event Form Handlers ---
  const handleEventChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setEventData({ ...eventData, [e.target.name]: e.target.value })
  }

  const submitEvent = async (e: React.FormEvent) => {
    e.preventDefault()
    setEventLoading(true)
    setEventError(null)
    try {
      const token = localStorage.getItem("token")
      const res = await fetch("/api/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(eventData),
      })

      if (res.ok) {
        setEventData({
          title: "",
          description: "",
          date: "",
          location: "",
        })
        showToast("Event created successfully", "success")
      } else {
        const data = await res.json()
        setEventError(data.message || "Failed to create event")
      }
    } catch {
      setEventError("Unexpected error")
    } finally {
      setEventLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white p-6 rounded-t-xl">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        </div>

        <div className="p-6">
          <div className="w-full">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <div className="inline-flex h-10 items-center justify-center rounded-md bg-violet-100 p-1">
                <button
                  className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 ${
                    activeTab === "users"
                      ? "bg-violet-600 text-white"
                      : "text-violet-600 hover:bg-violet-200 hover:text-violet-900"
                  }`}
                  onClick={() => setActiveTab("users")}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-2"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                  Users
                </button>
                <button
                  className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 ${
                    activeTab === "events"
                      ? "bg-violet-600 text-white"
                      : "text-violet-600 hover:bg-violet-200 hover:text-violet-900"
                  }`}
                  onClick={() => setActiveTab("events")}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-2"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                    <line x1="16" x2="16" y1="2" y2="6" />
                    <line x1="8" x2="8" y1="2" y2="6" />
                    <line x1="3" x2="21" y1="10" y2="10" />
                  </svg>
                  Events
                </button>
              </div>

              <div className="flex gap-2 w-full sm:w-auto">
                {activeTab === "users" && (
                  <div className="relative w-full sm:w-auto">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="11" cy="11" r="8" />
                      <path d="m21 21-4.3-4.3" />
                    </svg>
                    <input
                      type="text"
                      placeholder="Search users..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9 w-full h-10 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:ring-offset-2"
                    />
                  </div>
                )}
              </div>
            </div>

            {activeTab === "users" && (
              <div>
                {usersError && <div className="bg-red-50 text-red-600 p-4 rounded-md mb-4">{usersError}</div>}

                {usersLoading ? (
                  <div className="flex justify-center items-center py-12">
                    <svg
                      className="animate-spin h-8 w-8 text-violet-600"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  </div>
                ) : (
                  <div className="rounded-md border overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-violet-50">
                        <tr>
                          <th className="h-12 px-4 text-left align-middle font-medium text-gray-500">Name</th>
                          <th className="h-12 px-4 text-left align-middle font-medium text-gray-500">Email</th>
                          <th className="h-12 px-4 text-left align-middle font-medium text-gray-500">Type</th>
                          <th className="h-12 px-4 text-left align-middle font-medium text-gray-500">Phone</th>
                          <th className="h-12 px-4 text-right align-middle font-medium text-gray-500">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredUsers.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="text-center py-8 text-gray-500">
                              {searchTerm ? "No users match your search" : "No users found"}
                            </td>
                          </tr>
                        ) : (
                          filteredUsers.map((user) => (
                            <tr key={user.id} className="border-t border-gray-200 hover:bg-violet-50">
                              <td className="p-4 align-middle font-medium">{user.fullName}</td>
                              <td className="p-4 align-middle">{user.email}</td>
                              <td className="p-4 align-middle">
                                <span
                                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                    user.userType === "ADMIN"
                                      ? "bg-red-100 text-red-800"
                                      : "bg-violet-100 text-violet-800"
                                  } capitalize`}
                                >
                                  {user.userType.toLowerCase()}
                                </span>
                              </td>
                              <td className="p-4 align-middle">{user.phone}</td>
                              <td className="p-4 align-middle text-right">
                                <div className="flex justify-end gap-2">
                                  <button
                                    onClick={() => router.push(`/admin/manage/users/${user.id}`)}
                                    className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-violet-200 bg-white hover:bg-violet-50 hover:text-violet-700 h-8 px-3 py-2 text-violet-600"
                                  >
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      className="h-4 w-4 mr-1"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="currentColor"
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    >
                                      <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                                      <path d="m15 5 4 4" />
                                    </svg>
                                    Edit
                                  </button>
                                  <button
                                    onClick={() => {
                                      if (confirm("Are you sure you want to delete this user?")) {
                                        handleDeleteUser(user.id)
                                      }
                                    }}
                                    className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-red-200 bg-white hover:bg-red-50 hover:text-red-700 h-8 px-3 py-2 text-red-600"
                                  >
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      className="h-4 w-4 mr-1"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="currentColor"
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    >
                                      <path d="M3 6h18" />
                                      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                                      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                                      <line x1="10" x2="10" y1="11" y2="17" />
                                      <line x1="14" x2="14" y1="11" y2="17" />
                                    </svg>
                                    Delete
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {activeTab === "events" && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Event Form */}
                <div className="md:col-span-2">
                  <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
                    <h2 className="text-xl font-semibold mb-4 flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-2 text-violet-600"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M5 12h14" />
                        <path d="M12 5v14" />
                      </svg>
                      Create New Event
                    </h2>

                    {eventError && (
                      <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm mb-4">{eventError}</div>
                    )}

                    <form onSubmit={submitEvent} className="space-y-4">
                      <div className="space-y-2">
                        <label htmlFor="title" className="text-sm font-medium">
                          Title
                        </label>
                        <input
                          id="title"
                          name="title"
                          value={eventData.title}
                          onChange={handleEventChange}
                          required
                          className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:ring-offset-2"
                        />
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="description" className="text-sm font-medium">
                          Description
                        </label>
                        <textarea
                          id="description"
                          name="description"
                          value={eventData.description}
                          onChange={handleEventChange}
                          required
                          rows={3}
                          className="flex w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:ring-offset-2"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label htmlFor="date" className="text-sm font-medium">
                            Date & Time
                          </label>
                          <input
                            id="date"
                            name="date"
                            type="datetime-local"
                            value={eventData.date}
                            onChange={handleEventChange}
                            required
                            className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:ring-offset-2"
                          />
                        </div>

                        <div className="space-y-2">
                          <label htmlFor="location" className="text-sm font-medium">
                            Location
                          </label>
                          <div className="relative">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="absolute left-3 top-2.5 h-4 w-4 text-gray-500"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                              <circle cx="12" cy="10" r="3" />
                            </svg>
                            <input
                              id="location"
                              name="location"
                              value={eventData.location}
                              onChange={handleEventChange}
                              required
                              className="flex h-10 w-full rounded-md border border-gray-300 bg-white pl-9 pr-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:ring-offset-2"
                            />
                          </div>
                        </div>
                      </div>


                      <div className="pt-4">
                        <button
                          type="submit"
                          disabled={eventLoading}
                          className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-violet-600 text-white hover:bg-violet-700 h-10 px-4 py-2 w-full md:w-auto"
                        >
                          {eventLoading ? (
                            <>
                              <svg
                                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                              >
                                <circle
                                  className="opacity-25"
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="currentColor"
                                  strokeWidth="4"
                                ></circle>
                                <path
                                  className="opacity-75"
                                  fill="currentColor"
                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                              </svg>
                              Creating...
                            </>
                          ) : (
                            <>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4 mr-2"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <path d="M5 12h14" />
                                <path d="M12 5v14" />
                              </svg>
                              Create Event
                            </>
                          )}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>

                {/* Event Info Panel */}
                <div className="bg-violet-50 rounded-lg border border-violet-200 border-dashed p-6 flex flex-col justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12 mx-auto text-violet-400 mb-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                    <line x1="16" x2="16" y1="2" y2="6" />
                    <line x1="8" x2="8" y1="2" y2="6" />
                    <line x1="3" x2="21" y1="10" y2="10" />
                  </svg>
                  <h3 className="text-lg font-medium text-gray-900 mb-2 text-center">Event Management</h3>
                  <p className="text-gray-500 mb-4 text-center">
                    Create and manage events for your users. Fill out the form to add a new event to the system.
                  </p>
                  <div className="bg-white rounded-lg p-4 mt-4">
                    <h4 className="font-medium text-violet-800 mb-2 flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-1"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" x2="12" y1="8" y2="12" />
                        <line x1="12" x2="12.01" y1="16" y2="16" />
                      </svg>
                      Tips
                    </h4>
                    <ul className="text-sm text-gray-600 space-y-2">
                      <li className="flex items-start">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 mr-1 text-violet-500 mt-0.5 flex-shrink-0"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="9 11 12 14 22 4" />
                          <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                        </svg>
                        Provide a clear and descriptive title
                      </li>
                      <li className="flex items-start">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 mr-1 text-violet-500 mt-0.5 flex-shrink-0"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="9 11 12 14 22 4" />
                          <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                        </svg>
                        Include all relevant details in the description
                      </li>
                      <li className="flex items-start">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 mr-1 text-violet-500 mt-0.5 flex-shrink-0"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="9 11 12 14 22 4" />
                          <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                        </svg>
                        Double-check the date and time format
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div
          className={`fixed bottom-4 right-4 z-50 flex items-center p-4 mb-4 rounded-lg ${
            toast.type === "success" ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"
          } transition-opacity duration-300`}
          role="alert"
        >
          <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 rounded-lg">
            {toast.type === "success" ? (
              <svg
                className="w-5 h-5 text-green-600"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            ) : (
              <svg
                className="w-5 h-5 text-red-600"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            )}
          </div>
          <div className="ml-3 text-sm font-normal">{toast.message}</div>
          <button
            type="button"
            className="ml-auto -mx-1.5 -my-1.5 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 inline-flex h-8 w-8 hover:bg-gray-100"
            onClick={() => setToast(null)}
            aria-label="Close"
          >
            <span className="sr-only">Close</span>
            <svg
              className="w-5 h-5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}
    </div>
  )
}
