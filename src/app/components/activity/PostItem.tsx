"use client"

import { useState } from "react"
import CommentForm from "./CommentForm"
import LikeButton from "./LikeButton"
import { MessageCircle, Heart, ChevronDown, ChevronUp, Calendar, MoreHorizontal } from "lucide-react"

interface Comment {
  id: string
  content: string
  author: { name: string; fullName: string }
  createdAt: string
}

interface Like {
  id: string
  userId: string
}

interface Post {
  id: string
  author: { name: string; fullName: string }
  content: string
  likes: Like[]
  comments: Comment[]
  imageUrl?: string
  createdAt: string
}

interface PostItemProps {
  post: Post
  refreshPosts: () => void
  currentUserId: string | null
  userType: string | null
}

export default function PostItem({ post, refreshPosts, currentUserId, userType }: PostItemProps) {
  const [showComments, setShowComments] = useState(false)

  // Compute if the current user has already liked this post.
  const alreadyLiked = currentUserId ? post.likes.some((like) => like.userId === currentUserId) : false

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-200 hover:shadow-md">
      {/* Post Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
              {post.author.fullName?.charAt(0) || "U"}
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">{post.author.fullName}</h3>
              <div className="flex items-center text-xs text-gray-500">
                <Calendar className="h-3 w-3 mr-1" />
                <span>{formatDate(post.createdAt)}</span>
              </div>
            </div>
          </div>

          <button className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors duration-200">
            <MoreHorizontal className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Post Content */}
      <div className="p-4">
        <p className="text-gray-700 whitespace-pre-line">{post.content}</p>
      </div>

      {/* Post Image (if any) */}
      {post.imageUrl && (
        <div className="relative w-full h-64 md:h-80 bg-gray-100">
          <img
            src={post.imageUrl || "/placeholder.svg"}
            alt="Post attachment"
            className="w-full h-full object-contain"
          />
        </div>
      )}

      {/* Post Actions */}
      <div className="p-4 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* Like Button - Only for students */}
            {userType === "STUDENT" && currentUserId && (
              <LikeButton
                postId={post.id}
                refreshPosts={refreshPosts}
                userId={currentUserId}
                likeCount={post.likes.length}
                alreadyLiked={alreadyLiked}
              />
            )}

            {/* Like count for non-students */}
            {userType !== "STUDENT" && (
              <div className="flex items-center text-gray-500 text-sm">
                <Heart className={`h-4 w-4 mr-1 ${post.likes.length > 0 ? "text-red-500" : "text-gray-400"}`} />
                <span>
                  {post.likes.length} {post.likes.length === 1 ? "like" : "likes"}
                </span>
              </div>
            )}

            {/* Comments toggle button */}
            <button
              onClick={() => setShowComments(!showComments)}
              className="flex items-center text-sm text-gray-500 hover:text-indigo-600 transition-colors duration-150"
            >
              <MessageCircle className="h-4 w-4 mr-1" />
              <span>Comments ({post.comments.length})</span>
              {showComments ? <ChevronUp className="h-4 w-4 ml-1" /> : <ChevronDown className="h-4 w-4 ml-1" />}
            </button>
          </div>
        </div>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="p-4 bg-gray-50 border-t border-gray-100 animate-fadeIn">
          {/* Comment Form */}
          {currentUserId && (
            <div className="mb-4">
              <CommentForm postId={post.id} refreshPosts={refreshPosts} authorId={currentUserId} />
            </div>
          )}

          {/* Comments List */}
          <div className="space-y-3">
            {post.comments.length === 0 ? (
              <p className="text-center text-sm text-gray-500 py-2">No comments yet</p>
            ) : (
              post.comments.map((comment) => (
                <div key={comment.id} className="bg-white p-3 rounded-lg border border-gray-200">
                  <div className="flex items-center space-x-2 mb-1">
                    <div className="h-6 w-6 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-xs font-bold">
                      {comment.author.fullName?.charAt(0) || "U"}
                    </div>
                    <span className="font-medium text-sm text-gray-800">{comment.author.fullName}</span>
                    <span className="text-xs text-gray-400">{comment.createdAt && formatDate(comment.createdAt)}</span>
                  </div>
                  <p className="text-sm text-gray-700 pl-8">{comment.content}</p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}

