"use client"

import type React from "react"

import { useState } from "react"
import { Send } from "lucide-react"

interface CommentFormProps {
  postId: string
  authorId: string
  refreshPosts: () => void
}

export default function CommentForm({ postId, authorId, refreshPosts }: CommentFormProps) {
  const [content, setContent] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (content.trim() === "") return

    setIsSubmitting(true)
    setError("")

    try {
      const res = await fetch(`/api/activity/${postId}/comment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, authorId }),
      })

      if (res.ok) {
        setContent("")
        refreshPosts()
      } else {
        const errorData = await res.json()
        setError(errorData.message || "Failed to post comment")
      }
    } catch (error) {
      console.error("Error posting comment:", error)
      setError("An unexpected error occurred")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleComment} className="space-y-2">
      <div className="flex space-x-2">
        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Add a comment..."
          className="flex-grow p-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-all duration-200"
          disabled={isSubmitting}
          required
        />
        <button
          type="submit"
          disabled={isSubmitting || content.trim() === ""}
          className={`
            flex items-center justify-center px-3 py-2 rounded-lg text-white
            ${
              isSubmitting || content.trim() === ""
                ? "bg-indigo-300 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700 transition-colors duration-200"
            }
          `}
        >
          <Send className="h-4 w-4" />
          <span className="sr-only">Comment</span>
        </button>
      </div>

      {error && <p className="text-xs text-red-500 px-1">{error}</p>}
    </form>
  )
}

