"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function PostJob() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: "",
    company: "",
    description: "",
    location: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    try {
      // Decode user ID from token
      const decoded: { userId: string } = JSON.parse(atob(token.split(".")[1]));

      const res = await fetch("/api/post-job", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, postedById: decoded.userId }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to post job");

      setSuccess("✅ Job posted successfully!");
      setForm({ title: "", company: "", description: "", location: "" });
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-8 bg-gradient-to-br from-white to-gray-50 shadow-xl rounded-2xl mt-10 border border-gray-100">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 flex items-center gap-2">
        <span className="bg-blue-600 text-white p-1 rounded-lg">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </span>
        Post a Job
      </h1>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-md">
          <p className="text-red-700 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </p>
        </div>
      )}
      
      {success && (
        <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 rounded-md">
          <p className="text-green-700 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            {success}
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">Job Title</label>
          <input
            id="title"
            type="text"
            name="title"
            placeholder="e.g. Senior Frontend Developer"
            value={form.title}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 outline-none"
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="company" className="block text-sm font-medium text-gray-700">Company Name</label>
          <input
            id="company"
            type="text"
            name="company"
            placeholder="e.g. Acme Inc."
            value={form.company}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 outline-none"
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="location" className="block text-sm font-medium text-gray-700">Job Location</label>
          <input
            id="location"
            type="text"
            name="location"
            placeholder="e.g. Remote, New York, NY"
            value={form.location}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 outline-none"
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Job Description</label>
          <textarea
            id="description"
            name="description"
            placeholder="Describe the job responsibilities, requirements, and benefits..."
            value={form.description}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 outline-none"
            rows={6}
            required
          ></textarea>
        </div>

        <button
          type="submit"
          className={`w-full py-3 px-4 rounded-lg text-white font-medium transition-all duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
            loading 
              ? "bg-blue-400 cursor-not-allowed" 
              : "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-md hover:shadow-lg"
          }`}
          disabled={loading}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Posting...
            </span>
          ) : (
            "Post Job"
          )}
        </button>
      </form>
    </div>
  );
}