
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import jwt from "jsonwebtoken";
import { use } from "react";  // Import use from React



// Define the UserData interface to enforce type safety
interface UserData {
  fullName: string;
  email: string;
  phone: string;
}

const AdminEditUser = ({ params }: { params: Promise<{ id: string }> }) => {
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Unwrap params using React.use()
  const { id } = use(params); // Now we have direct access to id

  // Check if the user is an admin, and if not, redirect them
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");  // Redirect to login if no token is found
      return;
    }

    try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const decodedToken: any = jwt.decode(token);  // Decode JWT token to check user type
      if (!decodedToken || decodedToken.userType !== 'ADMIN') {
        router.push("/dashboard");  // Redirect to regular dashboard if not an admin
      }
    } catch (error) {
      setError("Invalid or expired token.");  // Handle token decoding error
      console.error("Token decoding error:", error);
      router.push("/login");  // Redirect to login on error
    }
  }, [router]);

  // Fetch user data when the component mounts or the user ID changes
  useEffect(() => {
    let isMounted = true; // Flag to check if the component is still mounted

    const fetchUser = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`/api/user/${id}`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });

        const data = await response.json();
        if (!isMounted) return; // Don't set state if the component is unmounted

        setIsLoading(false);

        if (response.ok) {
          setUserData(data);
        } else {
          setError(data.message || "Error fetching user.");
        }
      } catch (error) {
        if (!isMounted) return;
        setIsLoading(false);
        console.error("Error fetching user:", error);
        setError("An unexpected error occurred.");
      }
    };

    fetchUser();

    return () => {
      isMounted = false; // Clean up the flag on unmount
    };
  }, [id]);

  // Handle changes to the form fields
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setUserData({
      ...userData!,
      [e.target.name]: e.target.value,
    });
  };

  // Submit the updated user data
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); // Reset error before submission
    setIsLoading(true); // Set loading to true

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/user/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();
      setIsLoading(false); // Set loading to false after submission

      if (response.ok) {
        alert("User updated successfully.");
        router.push("/admin/manage/users");
      } else {
        setError(data.message || "Error updating user.");
      }
    } catch (error) {
      setIsLoading(false); // Set loading to false on error
      console.error("Error updating user:", error);
      setError("An unexpected error occurred while updating the user.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-2xl">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">Edit User Profile</h3>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">Full Name</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={userData?.fullName || ""}
                onChange={handleChange}
                required
                className="mt-1 p-2 w-full border border-gray-300 rounded-md"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={userData?.email || ""}
                onChange={handleChange}
                disabled
                className="mt-1 p-2 w-full border border-gray-300 rounded-md"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone</label>
              <input
                type="text"
                id="phone"
                name="phone"
                value={userData?.phone || ""}
                onChange={handleChange}
                required
                className="mt-1 p-2 w-full border border-gray-300 rounded-md"
              />
            </div>

            <div className="flex justify-between">
              <button
                type="button"
                onClick={() => router.push("/admin/manage/users")}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                disabled={isLoading}
              >
                {isLoading ? "Submitting..." : "Update"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default AdminEditUser;
