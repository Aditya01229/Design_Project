"use client"

import { useState } from "react"
import { Heart } from "lucide-react"

interface LikeButtonProps {
  postId: string
  userId: string
  likeCount: number
  refreshPosts: () => void
  alreadyLiked: boolean
}

export default function LikeButton({ postId, userId, likeCount, refreshPosts, alreadyLiked }: LikeButtonProps) {
  const [loading, setLoading] = useState(false)
  // Initialize liked state with the alreadyLiked prop.
  const [liked, setLiked] = useState(alreadyLiked)
  const [message, setMessage] = useState("")

  const handleLike = async () => {
    setLoading(true)
    setMessage("") // Clear previous message
    try {
      const res = await fetch(`/api/activity/${postId}/like`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      })
      if (res.ok) {
        setLiked(true)
        refreshPosts()
      } else {
        const data = await res.json()
        if (data.message === "Already liked!") {
          setLiked(true)
          setMessage("You have already liked this post.")
        } else {
          setMessage("Error: " + data.message)
        }
      }
    } catch (error) {
      console.error("Error liking post:", error)
      setMessage("An error occurred while liking the post.")
    }
    setLoading(false)
  }

  const handleUnlike = async () => {
    setLoading(true)
    setMessage("") // Clear previous message
    try {
      const res = await fetch(`/api/activity/${postId}/like`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      })
      if (res.ok) {
        setLiked(false)
        refreshPosts()
      } else {
        const data = await res.json()
        setMessage("Error: " + data.message)
      }
    } catch (error) {
      console.error("Error unliking post:", error)
      setMessage("An error occurred while unliking the post.")
    }
    setLoading(false)
  }

  // Toggle like/unlike based on current state.
  const handleClick = () => {
    if (liked) {
      handleUnlike()
    } else {
      handleLike()
    }
  }

  return (
    <div className="relative">
      <button
        onClick={handleClick}
        disabled={loading}
        className={`
          flex items-center space-x-1 text-sm rounded-lg px-3 py-1 transition-all duration-200
          ${liked ? "text-red-600 bg-red-50 hover:bg-red-100" : "text-gray-600 hover:text-red-600 hover:bg-red-50"}
        `}
        aria-label={liked ? "Unlike post" : "Like post"}
      >
        <Heart className={`h-4 w-4 ${liked ? "fill-red-500 text-red-500" : ""}`} />
        <span>{liked ? "Liked" : "Like"}</span>
        <span className="font-medium">({likeCount})</span>
      </button>

      {message && (
        <div className="absolute top-full left-0 mt-1 text-xs text-red-600 bg-red-50 p-1 rounded">{message}</div>
      )}
    </div>
  )
}

