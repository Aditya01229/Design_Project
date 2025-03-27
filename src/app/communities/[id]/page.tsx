/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function CommunityDetailPage() {
  const params = useParams();
  const communityId = params?.id;
  const [community, setCommunity] = useState<any>(null);
  const [isMember, setIsMember] = useState(false);

  useEffect(() => {
    async function fetchCommunity() {
      if (!communityId) return;

      const res = await fetch(`/api/communities/${communityId}`);
      if (res.ok) {
        const data = await res.json();
        setCommunity(data);

        const token = localStorage.getItem("token");
        if (token) {
          const userRes = await fetch("/api/auth/user", {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (userRes.ok) {
            const user = await userRes.json();
            const member = data.members.some((m: any) => m.userId === user.id);
            setIsMember(member);
          }
        }
      }
    }

    fetchCommunity();
  }, [communityId]);

  const handleJoinOrLeave = async (action: "join" | "leave") => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must be logged in.");
      return;
    }

    const res = await fetch(`/api/communities/${action}`, {
      method: action === "join" ? "POST" : "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ communityId }),
    });

    if (res.ok) {
      setIsMember(action === "join");
    } else {
      alert(`Error ${action === "join" ? "joining" : "leaving"} community`);
    }
  };

  if (!community) {
    return <p>Loading...</p>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-2">{community.name}</h1>
      <p className="mb-4">{community.description}</p>

      {isMember ? (
        <button
          onClick={() => handleJoinOrLeave("leave")}
          className="bg-red-500 text-white px-4 py-2 rounded-lg"
        >
          Leave Community
        </button>
      ) : (
        <button
          onClick={() => handleJoinOrLeave("join")}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg"
        >
          Join Community
        </button>
      )}

      <h2 className="text-2xl font-semibold mt-6">Members</h2>
      <ul className="list-disc ml-6">
        {community.members.map((member: any) => (
          <li key={member.id}>{member.user.fullName}</li>
        ))}
      </ul>

      <h2 className="text-2xl font-semibold mt-6">Posts</h2>
      {community.posts.length > 0 ? (
        <ul className="list-disc ml-6">
          {community.posts.map((post: any) => (
            <li key={post.id}>
              <strong>{post.author.fullName}:</strong> {post.content}
            </li>
          ))}
        </ul>
      ) : (
        <p>No posts yet.</p>
      )}
    </div>
  );
}
