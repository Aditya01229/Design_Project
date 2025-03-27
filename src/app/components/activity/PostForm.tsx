"use client"

import type React from "react"

import { useState } from "react"
import { Send, Image, X } from "lucide-react"

interface PostFormProps {
  authorId: string
  refreshPosts: () => void
}

export default function PostForm({ authorId, refreshPosts }: PostFormProps) {
  const [content, setContent] = useState("")
  const [imageUrl, setImageUrl] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [charCount, setCharCount] = useState(0)
  const MAX_CHARS = 500

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value
    if (newContent.length <= MAX_CHARS) {
      setContent(newContent)
      setCharCount(newContent.length)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (content.trim() === "") return

    setIsSubmitting(true)
    setError("")

    try {
      const res = await fetch("/api/activity", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, imageUrl, authorId }),
      })

      if (res.ok) {
        setContent("")
        setImageUrl("")
        setCharCount(0)
        refreshPosts()
      } else {
        const errorData = await res.json()
        setError(errorData.message || "Failed to create post")
      }
    } catch (error) {
      console.error("Error creating post:", error)
      setError("An unexpected error occurred")
    } finally {
      setIsSubmitting(false)
    }
  }

  const clearImage = () => {
    setImageUrl("")
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-xl p-4 border border-gray-100">
      <div className="space-y-3">
        <div className="relative">
          <textarea
            value={content}
            onChange={handleContentChange}
            placeholder="What's on your mind?"
            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-all duration-200 resize-none min-h-[100px]"
            required
          />
          <div
            className={`absolute bottom-2 right-2 text-xs ${charCount > MAX_CHARS * 0.8 ? "text-orange-500" : "text-gray-400"}`}
          >
            {charCount}/{MAX_CHARS}
          </div>
        </div>

        <div className="flex items-center space-x-2 p-2 border border-gray-200 rounded-lg bg-gray-50">
          <Image className="h-5 w-5 text-gray-500" />
          <input
            type="text"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="Image URL (optional)"
            className="flex-1 p-1 bg-transparent border-none focus:outline-none text-sm"
          />
          {imageUrl && (
            <button type="button" onClick={clearImage} className="text-gray-400 hover:text-gray-600">
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {imageUrl && (
          <div className="relative h-32 bg-gray-100 rounded-lg overflow-hidden">
            <img
              src={imageUrl || "/placeholder.svg"}
              alt="Preview"
              className="w-full h-full object-contain"
              onError={(e) => {
                e.currentTarget.src = "/placeholder.svg?height=128&width=256"
                setError("Invalid image URL. Please check and try again.")
              }}
            />
          </div>
        )}

        {error && <p className="text-sm text-red-500 p-2 bg-red-50 rounded-lg">{error}</p>}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting || content.trim() === ""}
            className={`
              flex items-center space-x-2 px-5 py-2 rounded-lg text-white font-medium
              ${
                isSubmitting || content.trim() === ""
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
    </form>
  )
}

