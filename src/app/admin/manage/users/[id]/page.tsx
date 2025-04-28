"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import jwt from "jsonwebtoken"
import { use } from "react"

// Define the UserData interface to enforce type safety
interface UserData {
  id?: string
  fullName: string
  email: string
  phone: string
  userType?: string
  createdAt?: string
}

const AdminEditUser = ({ params }: { params: Promise<{ id: string }> }) => {
  const router = useRouter()
  const [userData, setUserData] = useState<UserData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  // Unwrap params using React.use()
  const { id } = use(params) // Now we have direct access to id

  // Check if the user is an admin, and if not, redirect them
  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/login") // Redirect to login if no token is found
      return
    }

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const decodedToken: any = jwt.decode(token) // Decode JWT token to check user type
      if (!decodedToken || decodedToken.userType !== "ADMIN") {
        router.push("/dashboard") // Redirect to regular dashboard if not an admin
      }
    } catch (error) {
      setError("Invalid or expired token.") // Handle token decoding error
      console.error("Token decoding error:", error)
      router.push("/login") // Redirect to login on error
    }
  }, [router])

  // Fetch user data when the component mounts or the user ID changes
  useEffect(() => {
    let isMounted = true // Flag to check if the component is still mounted

    const fetchUser = async () => {
      setIsLoading(true)
      try {
        const token = localStorage.getItem("token")
        const response = await fetch(`/api/user/${id}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        const data = await response.json()
        if (!isMounted) return // Don't set state if the component is unmounted

        setIsLoading(false)

        if (response.ok) {
          setUserData(data)
        } else {
          setError(data.message || "Error fetching user.")
        }
      } catch (error) {
        if (!isMounted) return
        setIsLoading(false)
        console.error("Error fetching user:", error)
        setError("An unexpected error occurred.")
      }
    }

    fetchUser()

    return () => {
      isMounted = false // Clean up the flag on unmount
    }
  }, [id])

  // Handle changes to the form fields
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setUserData({
      ...userData!,
      [e.target.name]: e.target.value,
    })
  }

  // Submit the updated user data
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null) // Reset error before submission
    setIsSaving(true) // Set loading to true

    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`/api/user/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(userData),
      })

      const data = await response.json()
      setIsSaving(false) // Set loading to false after submission

      if (response.ok) {
        // Show success message
        alert("User updated successfully.")
        router.push("/admin/manage/users")
      } else {
        setError(data.message || "Error updating user.")
      }
    } catch (error) {
      setIsSaving(false) // Set loading to false on error
      console.error("Error updating user:", error)
      setError("An unexpected error occurred while updating the user.")
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 to-indigo-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white p-6">
            <div className="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              <h1 className="text-xl font-bold">Edit User Profile</h1>
            </div>
            {userData && (
              <div className="flex items-center gap-2 mt-2 text-violet-100">
                <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-white/20 text-white">
                  {userData.userType}
                </span>
                {userData.createdAt && <span className="text-xs">Member since {formatDate(userData.createdAt)}</span>}
              </div>
            )}
          </div>

          <div className="p-6">
            {error && (
              <div
                className="flex p-4 mb-6 text-sm text-red-800 border border-red-300 rounded-lg bg-red-50"
                role="alert"
              >
                <svg
                  className="flex-shrink-0 inline w-5 h-5 mr-3"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM10 15a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm1-4a1 1 0 0 1-2 0V6a1 1 0 0 1 2 0v5Z" />
                </svg>
                <span className="sr-only">Error</span>
                <div>{error}</div>
              </div>
            )}

            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <svg
                  className="animate-spin h-8 w-8 text-violet-600"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="fullName" className="text-sm font-medium text-gray-700 flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-2 text-violet-500"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                      Full Name
                    </label>
                    <input
                      id="fullName"
                      name="fullName"
                      value={userData?.fullName || ""}
                      onChange={handleChange}
                      required
                      className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:ring-offset-2"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium text-gray-700 flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-2 text-violet-500"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect width="20" height="16" x="2" y="4" rx="2" />
                        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                      </svg>
                      Email
                    </label>
                    <input
                      id="email"
                      name="email"
                      value={userData?.email || ""}
                      onChange={handleChange}
                      disabled
                      className="flex h-10 w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-500 cursor-not-allowed"
                    />
                    <p className="text-xs text-gray-500">Email cannot be changed</p>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="phone" className="text-sm font-medium text-gray-700 flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-2 text-violet-500"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                      </svg>
                      Phone
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      value={userData?.phone || ""}
                      onChange={handleChange}
                      required
                      className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:ring-offset-2"
                    />
                  </div>
                </div>

                <hr className="border-gray-200" />

                <div className="flex justify-between pt-2">
                  <button
                    type="button"
                    onClick={() => router.push("/admin/manage/users")}
                    className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-gray-300 bg-white hover:bg-gray-100 h-10 px-4 py-2"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-violet-600 text-white hover:bg-violet-700 h-10 px-4 py-2"
                  >
                    {isSaving ? (
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
                        Saving...
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
                          <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                          <polyline points="17 21 17 13 7 13 7 21" />
                          <polyline points="7 3 7 8 15 8" />
                        </svg>
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminEditUser
