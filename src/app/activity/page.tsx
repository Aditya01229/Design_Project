"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import PostItem from "../components/activity/PostItem";

interface User {
  userId: string;
  userType: "STUDENT" | "ALUMNI";
}

interface Comment {
  id: string;
  content: string;
  author: { name: string };
}

interface Post {
  id: string;
  author: { name: string };
  content: string;
  likes: number;
  comments: Comment[];
  imageUrl?: string;
}

export default function ActivityPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPost, setNewPost] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(true);

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
  };

  if (loading) return <p className="text-center mt-10 text-gray-700">Loading...</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-blue-600 mb-4">Activity Feed</h1>

      {/* New Post Input (Only for Alumni) */}
      {user?.userType === "ALUMNI" && (
        <div className="bg-white shadow-md p-4 rounded-lg mb-6">
          <textarea
            className="w-full p-2 border rounded mb-2"
            placeholder="Share something..."
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
          />
          <input
            type="text"
            className="w-full p-2 border rounded mb-2"
            placeholder="Paste image URL (optional)"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
          />
          <button
            onClick={handlePostSubmit}
            className="bg-blue-500 text-white px-4 py-2 mt-2 rounded hover:bg-blue-600"
          >
            Post
          </button>
        </div>
      )}

      {/* Posts List */}
      {posts.length === 0 ? (
        <p className="text-gray-600 text-center">No posts yet.</p>
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
  );
}
