/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { 
  ArrowLeft, 
  Users, 
  LogOut, 
  UserPlus, 
  MessageSquare, 
  Calendar,
  Loader2
} from "lucide-react";

export default function CommunityDetailPage() {
  const params = useParams();
  const router = useRouter();
  console.log(router)
  const communityId = params?.id;
  const [community, setCommunity] = useState<any>(null);
  const [isMember, setIsMember] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchCommunity() {
      if (!communityId) return;
      
      setIsLoading(true);
      setError("");
      
      try {
        const res = await fetch(`/api/communities/${communityId}`);
        if (res.ok) {
          const data = await res.json();
          setCommunity(data);

          const token = localStorage.getItem("token");
          if (token) {
            const userRes = await fetch("/api/auth/user", {
              headers: { Authorization: `Bearer ${token}` },
            });
            if (userRes.ok) {
              const user = await userRes.json();
              const member = data.members.some((m: any) => m.userId === user.id);
              setIsMember(member);
            }
          }
        } else {
          setError("Failed to load community details");
        }
      } catch (err) {
        console.error("Error fetching community:", err);
        setError("An unexpected error occurred");
      } finally {
        setIsLoading(false);
      }
    }

    fetchCommunity();
  }, [communityId]);

  const handleJoinOrLeave = async (action: "join" | "leave") => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must be logged in.");
      return;
    }

    setIsActionLoading(true);

    try {
      const res = await fetch(`/api/communities/${action}`, {
        method: action === "join" ? "POST" : "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ communityId }),
      });

      if (res.ok) {
        setIsMember(action === "join");
      } else {
        alert(`Error ${action === "join" ? "joining" : "leaving"} community`);
      }
    } catch (err) {
      console.error("Error updating community membership:", err);
      alert("An unexpected error occurred");
    } finally {
      setIsActionLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12 sm:px-6 lg:px-8 flex flex-col items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600 mb-4" />
        <p className="text-gray-600">Loading community details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg mb-6">
          {error}
        </div>
        <Link 
          href="/communities" 
          className="inline-flex items-center text-blue-600 hover:text-blue-800"
        >
          <ArrowLeft size={16} className="mr-2" />
          Return to Communities
        </Link>
      </div>
    );
  }

  if (!community) {
    return null;
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    }).format(date);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
      {/* Header with Back Link */}
      <Link 
        href="/communities" 
        className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft size={16} className="mr-2" />
        Back to Communities
      </Link>
      
      {/* Community Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between">
          <div className="flex-grow mb-6 md:mb-0">
            <h1 className="text-3xl font-bold text-gray-900 mb-3">{community.name}</h1>
            <p className="text-gray-600 mb-4">{community.description}</p>
            <div className="flex items-center text-gray-500">
              <Users size={16} className="mr-2" />
              <span>{community.members?.length || 0} members</span>
              {community.createdAt && (
                <>
                  <span className="mx-2">•</span>
                  <Calendar size={16} className="mr-2" />
                  <span>Created {formatDate(community.createdAt)}</span>
                </>
              )}
            </div>
          </div>
          
          <div>
            {isMember ? (
              <button
                onClick={() => handleJoinOrLeave("leave")}
                disabled={isActionLoading}
                className="flex items-center justify-center gap-2 bg-red-100 hover:bg-red-200 text-red-700 font-medium px-5 py-2.5 rounded-lg transition-colors"
              >
                {isActionLoading ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <LogOut size={18} />
                )}
                <span>Leave Community</span>
              </button>
            ) : (
              <button
                onClick={() => handleJoinOrLeave("join")}
                disabled={isActionLoading}
                className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2.5 rounded-lg transition-colors"
              >
                {isActionLoading ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <UserPlus size={18} />
                )}
                <span>Join Community</span>
              </button>
            )}
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Members Panel */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <Users size={20} className="mr-2" />
              Members
            </h2>
            
            {community.members && community.members.length > 0 ? (
              <div className="space-y-3">
                {community.members.map((member: any) => (
                  <div key={member.id} className="flex items-center">
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                      {member.user?.fullName?.charAt(0) || "U"}
                    </div>
                    <div className="text-gray-900">{member.user?.fullName || "Unknown User"}</div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No members yet.</p>
            )}
          </div>
        </div>
        
        {/* Posts Panel */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <MessageSquare size={20} className="mr-2" />
              Posts
            </h2>
            
            {community.posts && community.posts.length > 0 ? (
              <div className="space-y-6">
                {community.posts.map((post: any) => (
                  <div key={post.id} className="border-b border-gray-200 pb-6 last:border-0 last:pb-0">
                    <div className="flex items-center mb-3">
                      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                        {post.author?.fullName?.charAt(0) || "U"}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">
                          {post.author?.fullName || "Unknown User"}
                        </div>
                        {post.createdAt && (
                          <div className="text-xs text-gray-500">
                            {formatDate(post.createdAt)}
                          </div>
                        )}
                      </div>
                    </div>
                    <p className="text-gray-700">{post.content}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <MessageSquare size={40} className="mx-auto text-gray-300 mb-3" />
                <p className="text-gray-500 mb-3">No posts in this community yet</p>
                {isMember && (
                  <button className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg transition-colors">
                    Create First Post
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}