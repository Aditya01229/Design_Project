// File: src/components/activity/LikeButton.tsx
'use client';

import { useState } from 'react';

interface LikeButtonProps {
  postId: string;
  userId: string;
  likeCount: number;
  refreshPosts: () => void;
  alreadyLiked: boolean;
}

export default function LikeButton({ postId, userId, likeCount, refreshPosts, alreadyLiked }: LikeButtonProps) {
  const [loading, setLoading] = useState(false);
  // Initialize liked state with the alreadyLiked prop.
  const [liked, setLiked] = useState(alreadyLiked);
  const [message, setMessage] = useState("");

  const handleLike = async () => {
    setLoading(true);
    setMessage(""); // Clear previous message
    try {
      const res = await fetch(`/api/activity/${postId}/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });
      if (res.ok) {
        setLiked(true);
        refreshPosts();
      } else {
        const data = await res.json();
        if (data.message === "Already liked!") {
          setLiked(true);
          setMessage("You have already liked this post.");
        } else {
          setMessage("Error: " + data.message);
        }
      }
    } catch (error) {
      console.error('Error liking post:', error);
      setMessage("An error occurred while liking the post.");
    }
    setLoading(false);
  };

  const handleUnlike = async () => {
    setLoading(true);
    setMessage(""); // Clear previous message
    try {
      const res = await fetch(`/api/activity/${postId}/like`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });
      if (res.ok) {
        setLiked(false);
        refreshPosts();
      } else {
        const data = await res.json();
        setMessage("Error: " + data.message);
      }
    } catch (error) {
      console.error('Error unliking post:', error);
      setMessage("An error occurred while unliking the post.");
    }
    setLoading(false);
  };

  // Toggle like/unlike based on current state.
  const handleClick = () => {
    if (liked) {
      handleUnlike();
    } else {
      handleLike();
    }
  };

  return (
    <div>
      <button
        onClick={handleClick}
        disabled={loading}
        className={`px-3 py-1 text-white rounded ${liked ? 'bg-red-500' : 'bg-blue-500'}`}
      >
        {liked ? `Liked (${likeCount})` : `Like (${likeCount})`}
      </button>
      {message && <p className="mt-2 text-red-600 text-sm">{message}</p>}
    </div>
  );
}
