"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { Activity, Image, Send } from 'lucide-react';
import PostItem from "../components/activity/PostItem";

interface User {
  userId: string;
  userType: "STUDENT" | "ALUMNI";
}

interface Comment {
  id: string;
  content: string;
  author: { name: string; fullName: string };
  createdAt: string;
}

interface Like {
  id: string;
  userId: string;
}

interface Post {
  id: string;
  author: { name: string; fullName: string };
  content: string;
  likes: Like[];
  comments: Comment[];
  imageUrl?: string;
  createdAt: string;
}

export default function ActivityPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPost, setNewPost] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch user details from token
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    try {
      const decoded: { userId: string; userType: "STUDENT" | "ALUMNI" } = jwtDecode(token);
      setUser({ userId: decoded.userId, userType: decoded.userType });
    } catch (error) {
      console.error("Invalid token:", error);
      router.push("/login");
    }
  }, [router]);

  // Wrap refreshPosts with useCallback so its reference remains stable
  const refreshPosts = useCallback(async () => {
    try {
      const res = await fetch("/api/activity");
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setPosts(data);
    } catch (error) {
      console.error("Failed to refresh posts:", error);
    }
  }, []);

  // Initial fetch of posts from API
  useEffect(() => {
    refreshPosts().finally(() => setLoading(false));
  }, [refreshPosts]);

  // Handle new post submission with content and imageUrl
  const handlePostSubmit = async () => {
    if (!user || newPost.trim() === "") return;
    
    setIsSubmitting(true);
    
    try {
      const res = await fetch("/api/activity", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: newPost, imageUrl, authorId: user.userId }),
      });

      if (res.ok) {
        const createdPost = await res.json();
        setPosts([createdPost, ...posts]); // Prepend the new post
        setNewPost(""); // Clear post content
        setImageUrl(""); // Clear image URL input
      } else {
        console.error("Failed to create post:", await res.text());
      }
    } catch (error) {
      console.error("Error creating post:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto p-4 sm:p-6">
        <div className="flex items-center space-x-2 mb-6">
          <div className="h-8 w-8 bg-indigo-100 rounded-full animate-pulse"></div>
          <div className="h-8 w-40 bg-indigo-100 rounded-md animate-pulse"></div>
        </div>
        
        {[1, 2, 3].map((i) => (
          <div key={i} className="mb-6 rounded-xl bg-white shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex items-center space-x-3">
              <div className="h-10 w-10 rounded-full bg-gray-100 animate-pulse"></div>
              <div>
                <div className="h-4 w-32 bg-gray-100 rounded animate-pulse mb-2"></div>
                <div className="h-3 w-24 bg-gray-100 rounded animate-pulse"></div>
              </div>
            </div>
            <div className="p-4">
              <div className="h-4 w-full bg-gray-100 rounded animate-pulse mb-2"></div>
              <div className="h-4 w-3/4 bg-gray-100 rounded animate-pulse"></div>
            </div>
            <div className="h-48 bg-gray-50 animate-pulse"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 flex items-center">
        <span className="bg-indigo-100 text-indigo-600 p-2 rounded-full mr-3">
          <Activity className="h-5 w-5" />
        </span>
        Alumni Activity
      </h1>

      {/* New Post Input (Only for Alumni) */}
      {user?.userType === "ALUMNI" && (
        <div className="bg-white shadow-md rounded-xl p-4 mb-8 border border-gray-100">
          <div className="space-y-3">
            <textarea
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-all duration-200 resize-none min-h-[100px]"
              placeholder="Share something with the community..."
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
            />
            
            <div className="flex items-center space-x-2 p-2 border border-gray-200 rounded-lg bg-gray-50">
              <Image className="h-5 w-5 text-gray-500" />
              <input
                type="text"
                className="flex-1 p-1 bg-transparent border-none focus:outline-none text-sm"
                placeholder="Paste image URL (optional)"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
              />
            </div>
            
            <div className="flex justify-end">
              <button
                onClick={handlePostSubmit}
                disabled={isSubmitting || newPost.trim() === ""}
                className={`
                  flex items-center space-x-2 px-5 py-2 rounded-lg text-white font-medium
                  ${isSubmitting || newPost.trim() === "" 
                    ? "bg-indigo-300 cursor-not-allowed" 
                    : "bg-indigo-600 hover:bg-indigo-700 shadow-sm hover:shadow transition-all duration-200"
                  }
                `}
              >
                <Send className="h-4 w-4" />
                <span>{isSubmitting ? "Posting..." : "Post"}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Posts List */}
      <div className="space-y-6">
        {posts.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-100">
            <p className="text-gray-500 mb-2">No posts yet.</p>
            {user?.userType === "ALUMNI" && (
              <p className="text-sm text-indigo-600">Be the first to share something!</p>
            )}
          </div>
        ) : (
          posts.map((post) => (
            <PostItem
              key={post.id}
              post={post}
              refreshPosts={refreshPosts}
              currentUserId={user?.userId || null}
              userType={user?.userType || null}
            />
          ))
        )}
      </div>
    </div>
  );
}
