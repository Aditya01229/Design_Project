// File: src/components/activity/CommentForm.tsx
'use client';

import { useState } from 'react';

interface CommentFormProps {
  postId: string;
  authorId: string;
  refreshPosts: () => void;
}

export default function CommentForm({ postId, authorId, refreshPosts }: CommentFormProps) {
  const [content, setContent] = useState('');

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/activity/${postId}/comment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, authorId }),
      });
      if (res.ok) {
        setContent('');
        refreshPosts();
      }
    } catch (error) {
      console.error('Error posting comment:', error);
    }
  };

  return (
    <form onSubmit={handleComment} className="flex space-x-2">
      <input
        type="text"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Add a comment..."
        className="flex-grow p-2 border rounded"
        required
      />
      <button type="submit" className="px-3 py-2 bg-green-500 text-white rounded">
        Comment
      </button>
    </form>
  );
}
