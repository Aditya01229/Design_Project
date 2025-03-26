// File: src/components/activity/PostItem.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
import CommentForm from './CommentForm';
import LikeButton from './LikeButton';



interface PostItemProps {
  post: any;
  refreshPosts: () => void;
  currentUserId: string | null;
  userType: string | null;
}

export default function PostItem({ post, refreshPosts, currentUserId, userType }: PostItemProps) {
  const [showComments, setShowComments] = useState(false);

  // Compute if the current user has already liked this post.
  const alreadyLiked = currentUserId ? post.likes.some((like: any) => like.userId === currentUserId) : false;

  console.log('post:', post);
  console.log('refreshPosts:', refreshPosts);
  console.log('currentUserId:', currentUserId);
  console.log('userType:', userType);

  return (
    <div className="p-4 border rounded">
      <div className="flex items-center space-x-2 mb-2">
        <strong>{post.author.fullName}</strong>
        <span className="text-sm text-gray-500">
          {new Date(post.createdAt).toLocaleString()}
        </span>
      </div>
      <p>{post.content}</p>
      {post.imageUrl && (
        <img src={post.imageUrl} alt="Post image" className="mt-2 max-h-80 object-cover" />
      )}
      <div className="flex items-center mt-2 space-x-4">
        {/* Only allow students to like posts */}
        {userType === 'STUDENT' && currentUserId && (
          <LikeButton
            postId={post.id}
            refreshPosts={refreshPosts}
            userId={currentUserId}
            likeCount={post.likes.length}
            alreadyLiked={alreadyLiked}
          />
        )}
        <button onClick={() => setShowComments(!showComments)}>
          {showComments ? 'Hide Comments' : `Comments (${post.comments.length})`}
        </button>
      </div>
      {showComments && (
        <div className="mt-4 space-y-2">
          {post.comments.map((comment: any) => (
            <div key={comment.id} className="p-2 border rounded">
              <p className="text-sm">
                <strong>{comment.author.fullName}</strong>: {comment.content}
              </p>
            </div>
          ))}
          {/* Allow both alumni and students to comment */}
          {currentUserId && (
            <CommentForm postId={post.id} refreshPosts={refreshPosts} authorId={currentUserId} />
          )}
        </div>
      )}
    </div>
  );
}
