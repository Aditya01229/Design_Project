"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { jwtDecode } from "jwt-decode"
import { User, Briefcase, MapPin, Phone, Calendar, Globe, Linkedin, Code, Save, Loader2 } from "lucide-react"

interface UserData {
  id: string
  fullName: string
  email: string
  phone?: string
  graduationYear?: string
  language?: string
  linkedin?: string
  skills?: string
  userType: "STUDENT" | "ALUMNI"
  company?: string
  location?: string
}

export default function Dashboard() {
  const router = useRouter()
  const [user, setUser] = useState<UserData | null>(null)
  const [editableUser, setEditableUser] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")

  useEffect(() => {
    const token = localStorage.getItem("token")

    if (!token) {
      router.push("/login")
      return
    }

    try {
      const decoded: { userId: string } = jwtDecode(token)

      fetch(`/api/user/${decoded.userId}`)
        .then((res) => res.json())
        .then((data) => {
          setUser(data)
          setEditableUser(data)
        })
        .catch((err) => console.error("Failed to fetch user:", err))
        .finally(() => setLoading(false))
    } catch (error) {
      console.error("Invalid token:", error)
      router.push("/login")
    }
  }, [router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!editableUser) return
    setEditableUser({ ...editableUser, [e.target.name]: e.target.value })

    // Clear success message when user makes changes
    if (successMessage) setSuccessMessage("")
  }

  const handleSave = async () => {
    if (!editableUser) return
    setSaving(true)

    try {
      const res = await fetch(`/api/user/${editableUser.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editableUser),
      })

      if (!res.ok) throw new Error("Failed to update profile")

      setUser(editableUser)
      setSuccessMessage("Profile updated successfully!")

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage("")
      }, 3000)
    } catch (error) {
      console.error(error)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="flex flex-col items-center">
          <Loader2 className="h-10 w-10 text-indigo-600 animate-spin mb-2" />
          <p className="text-indigo-600">Loading your profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-6">
          <User className="h-8 w-8 text-indigo-600 mr-3" />
          <h1 className="text-3xl font-bold text-gray-800">Your Profile</h1>
        </div>

        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg flex items-center">
            <div className="mr-2 h-2 w-2 rounded-full bg-green-600"></div>
            {successMessage}
          </div>
        )}

        <div className="bg-white shadow-xl rounded-xl overflow-hidden">
          <div className="h-2 bg-gradient-to-r from-indigo-500 to-purple-600"></div>

          <div className="p-6">
            {/* Basic Information */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <User className="h-5 w-5 mr-2 text-indigo-600" />
                Basic Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <div className="p-3 bg-gray-50 rounded-lg text-gray-800 border border-gray-200">{user?.fullName}</div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <div className="p-3 bg-gray-50 rounded-lg text-gray-800 border border-gray-200">{user?.email}</div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <div className="relative rounded-lg shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="phone"
                      value={editableUser?.phone || ""}
                      onChange={handleChange}
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Your phone number"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Graduation Year</label>
                  <div className="relative rounded-lg shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Calendar className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="graduationYear"
                      value={editableUser?.graduationYear || ""}
                      onChange={handleChange}
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Year of graduation"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <Code className="h-5 w-5 mr-2 text-indigo-600" />
                Skills & Connections
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
                  <div className="relative rounded-lg shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Globe className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="language"
                      value={editableUser?.language || ""}
                      onChange={handleChange}
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Languages you speak"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn</label>
                  <div className="relative rounded-lg shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Linkedin className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="linkedin"
                      value={editableUser?.linkedin || ""}
                      onChange={handleChange}
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Your LinkedIn profile URL"
                    />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Skills</label>
                  <textarea
                    name="skills"
                    value={editableUser?.skills || ""}
                    onChange={handleChange}
                    rows={3}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="List your professional skills (e.g., Java, Project Management, Data Analysis)"
                  />
                </div>
              </div>
            </div>

            {/* Alumni Specific Fields */}
            {user?.userType === "ALUMNI" && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  <Briefcase className="h-5 w-5 mr-2 text-indigo-600" />
                  Professional Information
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                    <div className="relative rounded-lg shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Briefcase className="h-4 w-4 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        name="company"
                        value={editableUser?.company || ""}
                        onChange={handleChange}
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Current company"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                    <div className="relative rounded-lg shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <MapPin className="h-4 w-4 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        name="location"
                        value={editableUser?.location || ""}
                        onChange={handleChange}
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="City, Country"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end">
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

