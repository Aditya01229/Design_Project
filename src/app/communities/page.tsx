/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PlusCircle, Users, ArrowRight } from "lucide-react";

export default function CommunitiesPage() {
  const [communities, setCommunities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchCommunities() {
      try {
        setIsLoading(true);
        const res = await fetch("/api/communities");
        const data = await res.json();
        setCommunities(data);
      } catch (error) {
        console.error("Failed to fetch communities:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchCommunities();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Communities</h1>
          <p className="mt-2 text-gray-600">Join or create communities based on your interests</p>
        </div>
        <Link 
          href="/communities/create" 
          className="mt-4 sm:mt-0 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2.5 rounded-lg transition-colors"
        >
          <PlusCircle size={18} />
          <span>Create Community</span>
        </Link>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm p-6 animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
          ))}
        </div>
      ) : communities.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {communities.map((community: any) => (
            <Link href={`/communities/${community.id}`} key={community.id}>
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow h-full flex flex-col">
                <div className="flex items-start justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">{community.name}</h2>
                  <div className="flex items-center text-gray-500">
                    <Users size={16} />
                    <span className="ml-1 text-sm">{community.memberCount || 0}</span>
                  </div>
                </div>
                <p className="text-gray-600 mb-6 flex-grow">{community.description}</p>
                <div className="flex items-center text-blue-600 font-medium">
                  View Community
                  <ArrowRight size={16} className="ml-1" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Users size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-medium text-gray-900 mb-2">No communities found</h3>
          <p className="text-gray-600 mb-6">Be the first to create a community!</p>
          <Link 
            href="/communities/create" 
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2.5 rounded-lg transition-colors"
          >
            <PlusCircle size={18} />
            <span>Create Community</span>
          </Link>
        </div>
      )}
    </div>
  );
}