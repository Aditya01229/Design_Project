// File: src/components/activity/PostForm.tsx
'use client';

import { useState } from 'react';

interface PostFormProps {
  authorId: string;
  refreshPosts: () => void;
}

export default function PostForm({ authorId, refreshPosts }: PostFormProps) {
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/activity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, imageUrl, authorId }),
      });
      if (res.ok) {
        setContent('');
        setImageUrl('');
        refreshPosts();
      }
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="What's on your mind?"
        className="w-full p-2 border rounded mb-2"
        required
      />
      <input
        type="text"
        value={imageUrl}
        onChange={(e) => setImageUrl(e.target.value)}
        placeholder="Image URL (optional)"
        className="w-full p-2 border rounded mb-2"
      />
      <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
        Post
      </button>
    </form>
  );
}
