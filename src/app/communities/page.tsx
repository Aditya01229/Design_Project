// app/communities/page.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function CommunitiesPage() {
  const [communities, setCommunities] = useState([]);

  useEffect(() => {
    async function fetchCommunities() {
      const res = await fetch("/api/communities");
      const data = await res.json();
      setCommunities(data);
    }
    fetchCommunities();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Communities</h1>
      <Link href="/communities/create" className="bg-blue-500 text-white px-4 py-2 rounded-lg">
        Create Community
      </Link>
      <div className="mt-4 space-y-4">
        {communities.map((community: any) => (
          <div key={community.id} className="border p-4 rounded">
            <h2 className="text-xl font-semibold">{community.name}</h2>
            <p>{community.description}</p>
            <Link href={`/communities/${community.id}`} className="text-blue-500 underline">
              View Community
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
