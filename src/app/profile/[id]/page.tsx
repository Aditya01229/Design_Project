import { notFound } from "next/navigation"

type UserProfile = {
  id: string
  fullName: string
  email: string
  phone: string
  graduationYear?: string
  language?: string
  linkedin?: string
  skills?: string
  userType: string
  company?: string
  location?: string
  createdAt: string
}

async function getUser(userId: string): Promise<UserProfile | null> {
  try {
    const res = await fetch(`${process.env.BASE_URL}/api/user/${userId}`, {
      cache: "no-store",
    })

    if (!res.ok) {
      return null
    }

    return res.json()
  } catch (error) {
    console.error("Failed to fetch user:", error)
    return null
  }
}

export default async function UserProfilePage({ params }: { params: Promise<{ id: string }> }) {
  // Await params to get the id property
  const { id } = await params

  // Fetch user data using the id
  const user = await getUser(id)

  if (!user) {
    notFound() // show 404 if user not found
  }

  // Format skills as an array if they exist
  const skillsList = user.skills ? user.skills.split(",").map((skill) => skill.trim()) : []

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
          {/* Header with gradient */}
          <div className="relative">
            <div className="h-24 bg-gradient-to-r from-violet-600 to-indigo-600"></div>
            <div className="absolute -bottom-12 left-8">
              <div className="h-24 w-24 rounded-full bg-white p-1 shadow-lg">
                <div className="h-full w-full rounded-full bg-gradient-to-br from-violet-200 to-indigo-200 flex items-center justify-center">
                  <span className="text-3xl font-bold text-violet-700">{user.fullName.charAt(0)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* User name and type */}
          <div className="pt-16 pb-4 px-8">
            <h1 className="text-3xl font-bold text-gray-900">{user.fullName}</h1>
            <div className="flex items-center mt-1">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-violet-100 text-violet-800 mr-2 capitalize">
                {user.userType.toLowerCase()}
              </span>
              {user.location && (
                <span className="flex items-center text-sm text-gray-500">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3.5 w-3.5 mr-1"
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
                  {user.location}
                </span>
              )}
            </div>
          </div>

          <div className="p-8 pt-0 space-y-8">
            {/* Basic Information */}
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
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
                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                Basic Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">Email</p>
                  <p className="flex items-center text-gray-800">
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
                    {user.email}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">Phone</p>
                  <p className="flex items-center text-gray-800">
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
                    {user.phone}
                  </p>
                </div>
                {user.graduationYear && (
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-500">Graduation Year</p>
                    <p className="flex items-center text-gray-800">
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
                        <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                        <path d="M6 12v5c3 3 9 3 12 0v-5" />
                      </svg>
                      {user.graduationYear}
                    </p>
                  </div>
                )}
              </div>
            </section>

            <hr className="border-gray-200" />

            {/* Skills & Connections */}
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
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
                  <polyline points="16 18 22 12 16 6" />
                  <polyline points="8 6 2 12 8 18" />
                </svg>
                Skills & Connections
              </h2>
              <div className="space-y-6">
                {user.language && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-500">Language</p>
                    <p className="flex items-center text-gray-800">
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
                        <circle cx="12" cy="12" r="10" />
                        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                        <path d="M2 12h20" />
                      </svg>
                      {user.language}
                    </p>
                  </div>
                )}

                {user.linkedin && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-500">LinkedIn</p>
                    <a
                      href={user.linkedin.startsWith("http") ? user.linkedin : `https://${user.linkedin}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-violet-600 hover:text-violet-800 transition-colors"
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
                        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                        <rect width="4" height="12" x="2" y="9" />
                        <circle cx="4" cy="4" r="2" />
                      </svg>
                      {user.linkedin}
                    </a>
                  </div>
                )}

                {skillsList.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-500">Skills</p>
                    <div className="flex flex-wrap gap-2">
                      {skillsList.map((skill, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-violet-100 text-violet-800"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </section>

            {/* Alumni Specific Fields */}
            {user.userType === "ALUMNI" && (
              <>
                <hr className="border-gray-200" />
                <section>
                  <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
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
                      <path d="M20 7h-4a2 2 0 0 0-2 2v14" />
                      <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
                      <path d="M8 7H4a2 2 0 0 0-2 2v14" />
                      <path d="M16 21h2a2 2 0 0 0 2-2V9" />
                      <path d="M8 21h2a2 2 0 0 0 2-2V9" />
                    </svg>
                    Professional Information
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {user.company && (
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-gray-500">Company</p>
                        <p className="text-gray-800 font-medium">{user.company}</p>
                      </div>
                    )}
                    {user.location && (
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-gray-500">Location</p>
                        <p className="flex items-center text-gray-800">
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
                            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                            <circle cx="12" cy="10" r="3" />
                          </svg>
                          {user.location}
                        </p>
                      </div>
                    )}
                  </div>
                </section>
              </>
            )}

            {/* Footer */}
            <div className="pt-4 text-sm text-gray-500 flex items-center">
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
              <span>
                Member since{" "}
                {new Date(user.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
