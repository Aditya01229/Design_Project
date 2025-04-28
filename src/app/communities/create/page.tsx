"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Send } from "lucide-react";
import Link from "next/link";

export default function CreateCommunityPage() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("You must be logged in to create a community.");
        return;
      }

      const res = await fetch("/api/communities", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, description }),
      });

      if (res.ok) {
        router.push("/communities");
      } else {
        const data = await res.json();
        setError(data.message || "Error creating community");
      }
    } catch (err) {
      console.error("Error creating community:", err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 sm:px-6">
      <div className="mb-8">
        <Link 
          href="/communities" 
          className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft size={16} className="mr-2" />
          Back to Communities
        </Link>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Create Community</h1>
        <p className="mt-2 text-gray-600">Start a new community and connect with people who share your interests</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
              Community Name*
            </label>
            <input
              id="name"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              type="text"
              placeholder="Enter a unique name for your community"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          
          <div>
            <label htmlFor="description" className="block text-gray-700 font-medium mb-2">
              Description
            </label>
            <textarea
              id="description"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all min-h-32"
              placeholder="Describe what your community is about"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
            />
            <p className="mt-2 text-sm text-gray-500">
              A good description helps people understand what your community is about
            </p>
          </div>
          
          <div className="flex justify-end pt-4">
            <Link 
              href="/communities"
              className="px-5 py-2.5 mr-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Cancel
            </Link>
            <button 
              type="submit" 
              className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2.5 rounded-lg transition-colors disabled:opacity-70"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="animate-spin h-4 w-4 border-2 border-white border-r-transparent rounded-full"></span>
                  <span>Creating...</span>
                </>
              ) : (
                <>
                  <Send size={18} />
                  <span>Create Community</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}