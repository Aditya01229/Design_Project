"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { jwtDecode } from "jwt-decode" // Install via npm install jwt-decode

// User Type Definition
interface User {
  id: string
  fullName: string
  email: string
  userType: "STUDENT" | "ALUMNI"
}

// Event Type Definition
interface Event {
  id: string
  title: string
  description: string
  date: string
}

// Job Type Definition
interface Job {
  id: string
  title: string
  company: string
  description: string
  location: string
  postedById: string // Alumni ID who posted the job
}

export default function Dashboard() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [events, setEvents] = useState<Event[]>([])
  const [jobs, setJobs] = useState<Job[]>([])
  const [myJobs, setMyJobs] = useState<Job[]>([])
  const [appliedJobs, setAppliedJobs] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<"events" | "jobs" | "myJobs">("events")

  // Fetch all data (User, Events, Jobs)
  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token")
      if (!token) return router.push("/login")

      try {
        const decoded: { userId: string } = jwtDecode(token)
        const userRes = await fetch(`/api/user/${decoded.userId}`)
        const userData = await userRes.json()
        setUser(userData)

        const [eventRes, jobRes] = await Promise.all([fetch("/api/events"), fetch("/api/jobs")])
        const eventData = await eventRes.json()
        const jobData = await jobRes.json()

        setEvents(Array.isArray(eventData) ? eventData : [])
        setJobs(Array.isArray(jobData) ? jobData : [])
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Filter jobs posted by the alumni
  useEffect(() => {
    if (user?.userType === "ALUMNI") {
      setMyJobs(jobs.filter((job) => String(job.postedById) === String(user.id)))
    }
  }, [user, jobs])

  // Fetch applied jobs for students
  useEffect(() => {
    if (user?.userType === "STUDENT") {
      fetch(`/api/applied/${user.id}`)
        .then((res) => res.json())
        .then((data) => {
          setAppliedJobs(data.map((app: { jobId: string }) => app.jobId))
        })
        .catch((err) => console.error("Error fetching applied jobs:", err))
    }
  }, [user])

  const handlePostJob = () => router.push("/post-job")

  const handleApplyJob = async (jobId: string) => {
    if (!user) return
    try {
      const res = await fetch("/api/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, jobId }),
      })

      if (res.ok) setAppliedJobs((prev) => [...prev, jobId])
      else console.error("Error applying for job:", await res.json())
    } catch (error) {
      console.error("Error applying for job:", error)
    }
  }

  const handleDownloadApplications = async (jobId: string) => {
    try {
      const res = await fetch(`/api/download-applications?jobId=${jobId}`)
      if (!res.ok) throw new Error("Failed to download applications")

      const blob = await res.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `applications-${jobId}.xlsx`
      document.body.appendChild(a)
      a.click()
      a.remove()
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Error downloading Excel:", error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-6 mb-8 shadow-lg text-white">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold">Welcome, {user?.fullName} 👋</h1>
              <p className="mt-2 text-blue-100">
                {user?.userType === "STUDENT" ? "Student Dashboard" : "Alumni Dashboard"}
              </p>
            </div>

            {user?.userType === "ALUMNI" && (
              <button
                onClick={handlePostJob}
                className="mt-4 md:mt-0 px-6 py-3 bg-white text-blue-700 font-semibold rounded-lg hover:bg-blue-50 transition duration-200 shadow-md flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                    clipRule="evenodd"
                  />
                </svg>
                Post a Job
              </button>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-md mb-8 overflow-hidden">
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab("events")}
              className={`flex-1 py-4 px-6 text-center font-medium transition-colors duration-200 ${
                activeTab === "events"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-600 hover:text-blue-600"
              }`}
            >
              <span className="flex items-center justify-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                Upcoming Events
              </span>
            </button>

            <button
              onClick={() => setActiveTab("jobs")}
              className={`flex-1 py-4 px-6 text-center font-medium transition-colors duration-200 ${
                activeTab === "jobs" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-600 hover:text-blue-600"
              }`}
            >
              <span className="flex items-center justify-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                Job Openings
              </span>
            </button>

            {user?.userType === "ALUMNI" && (
              <button
                onClick={() => setActiveTab("myJobs")}
                className={`flex-1 py-4 px-6 text-center font-medium transition-colors duration-200 ${
                  activeTab === "myJobs"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-600 hover:text-blue-600"
                }`}
              >
                <span className="flex items-center justify-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                  Your Posted Jobs
                </span>
              </button>
            )}
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {/* Events Tab */}
            {activeTab === "events" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Upcoming Events</h2>
                {events.length > 0 ? (
                  <div className="grid gap-6 md:grid-cols-2">
                    {events.map((event) => (
                      <div
                        key={event.id}
                        className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
                      >
                        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 h-3"></div>
                        <div className="p-5">
                          <div className="flex justify-between items-start">
                            <h3 className="font-bold text-xl text-gray-800">{event.title}</h3>
                            <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                              {new Date(event.date).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="mt-3 text-gray-600">{event.description}</p>
                          <div className="mt-4 flex justify-end">
                            <button className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center gap-1">
                              Learn more
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10 bg-gray-50 rounded-lg">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-12 w-12 mx-auto text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <p className="mt-2 text-gray-500">No upcoming events at the moment.</p>
                  </div>
                )}
              </div>
            )}

            {/* Jobs Tab */}
            {activeTab === "jobs" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Latest Job Openings</h2>
                {jobs.length > 0 ? (
                  <div className="space-y-6">
                    {jobs.map((job) => (
                      <div
                        key={job.id}
                        className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
                      >
                        <div className="p-6">
                          <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                            <div>
                              <h3 className="font-bold text-xl text-gray-800">{job.title}</h3>
                              <div className="mt-1 flex items-center gap-2 text-gray-600">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-4 w-4"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                                  />
                                </svg>
                                <span className="font-medium">{job.company}</span>
                              </div>
                              <div className="mt-1 flex items-center gap-2 text-gray-500">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-4 w-4"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                  />
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                  />
                                </svg>
                                <span>{job.location}</span>
                              </div>
                            </div>

                            {user?.userType === "STUDENT" && (
                              <div>
                                {appliedJobs.includes(job.id) ? (
                                  <span className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-600 rounded-lg font-medium cursor-not-allowed">
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      className="h-5 w-5 mr-2 text-green-500"
                                      viewBox="0 0 20 20"
                                      fill="currentColor"
                                    >
                                      <path
                                        fillRule="evenodd"
                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                        clipRule="evenodd"
                                      />
                                    </svg>
                                    Applied
                                  </span>
                                ) : (
                                  <button
                                    onClick={() => handleApplyJob(job.id)}
                                    className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-medium hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-sm hover:shadow"
                                  >
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      className="h-5 w-5 mr-2"
                                      viewBox="0 0 20 20"
                                      fill="currentColor"
                                    >
                                      <path
                                        fillRule="evenodd"
                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                        clipRule="evenodd"
                                      />
                                    </svg>
                                    Apply for Job
                                  </button>
                                )}
                              </div>
                            )}
                          </div>

                          <div className="mt-4">
                            <div className="text-gray-600 line-clamp-3">{job.description}</div>
                            <button className="mt-2 text-blue-600 hover:text-blue-800 font-medium text-sm">
                              Read more
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10 bg-gray-50 rounded-lg">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-12 w-12 mx-auto text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    <p className="mt-2 text-gray-500">No job openings available at the moment.</p>
                  </div>
                )}
              </div>
            )}

            {/* My Jobs Tab (Alumni only) */}
            {activeTab === "myJobs" && user?.userType === "ALUMNI" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Posted Jobs</h2>
                {myJobs.length > 0 ? (
                  <div className="space-y-6">
                    {myJobs.map((job) => (
                      <div
                        key={job.id}
                        className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
                      >
                        <div className="p-6">
                          <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                            <div>
                              <h3 className="font-bold text-xl text-gray-800">{job.title}</h3>
                              <div className="mt-1 flex items-center gap-2 text-gray-600">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-4 w-4"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                                  />
                                </svg>
                                <span className="font-medium">{job.company}</span>
                              </div>
                              <div className="mt-1 flex items-center gap-2 text-gray-500">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-4 w-4"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                  />
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                  />
                                </svg>
                                <span>{job.location}</span>
                              </div>
                            </div>

                            <button
                              onClick={() => handleDownloadApplications(job.id)}
                              className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-medium hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-sm hover:shadow"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 mr-2"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                                />
                              </svg>
                              Download Applications
                            </button>
                          </div>

                          <div className="mt-4">
                            <div className="text-gray-600 line-clamp-3">{job.description}</div>
                            <div className="mt-4 flex justify-between items-center">
                              <button className="text-blue-600 hover:text-blue-800 font-medium text-sm">
                                View details
                              </button>
                              <span className="text-sm text-gray-500">Posted on {new Date().toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10 bg-gray-50 rounded-lg">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-12 w-12 mx-auto text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                      />
                    </svg>
                    <p className="mt-2 text-gray-500">You haven&apos;t posted any jobs yet.</p>
                    <button
                      onClick={handlePostJob}
                      className="mt-4 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
                    >
                      Post Your First Job
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}