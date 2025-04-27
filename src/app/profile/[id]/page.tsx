import { Briefcase, Code, User } from "lucide-react";
import { notFound } from "next/navigation";

type UserProfile = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  graduationYear?: string;
  language?: string;
  linkedin?: string;
  skills?: string;
  userType: string;
  company?: string;
  location?: string;
  createdAt: string;
};

async function getUser(userId: string): Promise<UserProfile | null> {
  try {
    const res = await fetch(`${process.env.BASE_URL}/api/user/${userId}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      return null;
    }

    return res.json();
  } catch (error) {
    console.error("Failed to fetch user:", error);
    return null;
  }
}

export default async function UserProfilePage({ params }: { params: Promise<{ id: string }> }) {
  // Await params to get the id property
  const { id } = await params;

  // Fetch user data using the id
  const user = await getUser(id);

  if (!user) {
    notFound(); // show 404 if user not found
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-6">
          <User className="h-8 w-8 text-indigo-600 mr-3" />
          <h1 className="text-3xl font-bold text-gray-800">User Profile</h1>
        </div>

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
                  <div className="p-3 bg-gray-50 rounded-lg text-gray-800 border border-gray-200">{user?.phone}</div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Graduation Year</label>
                  <div className="p-3 bg-gray-50 rounded-lg text-gray-800 border border-gray-200">{user?.graduationYear || "N/A"}</div>
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
                  <div className="p-3 bg-gray-50 rounded-lg text-gray-800 border border-gray-200">{user?.language || "N/A"}</div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn</label>
                  <div className="p-3 bg-gray-50 rounded-lg text-gray-800 border border-gray-200">{user?.linkedin || "N/A"}</div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Skills</label>
                  <div className="p-3 bg-gray-50 rounded-lg text-gray-800 border border-gray-200">{user?.skills || "N/A"}</div>
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
                    <div className="p-3 bg-gray-50 rounded-lg text-gray-800 border border-gray-200">{user?.company || "N/A"}</div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                    <div className="p-3 bg-gray-50 rounded-lg text-gray-800 border border-gray-200">{user?.location || "N/A"}</div>
                  </div>
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="mt-8 text-sm text-gray-500">
              <p>Joined At: {new Date(user.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
