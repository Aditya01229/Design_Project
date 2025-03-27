"use client";

import { useState } from "react";

// SVG Icon Components
const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
  </svg>
);

const PlusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
  </svg>
);

const CodeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
  </svg>
);

const BookIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
  </svg>
);

const GlobeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A9.015 9.015 0 0012 21a9.015 9.015 0 00-8.716-6.747" />
  </svg>
);

// Community interface
interface Community {
  id: number;
  name: string;
  description: string;
  memberCount: number;
  icon: React.ComponentType;
  tags: string[];
}

// Sample communities data
const initialCommunities: Community[] = [
  {
    id: 1,
    name: "Tech Innovators",
    description: "Connect with fellow tech enthusiasts and share cutting-edge innovations.",
    memberCount: 1245,
    icon: CodeIcon,
    tags: ["Programming", "Technology", "Innovation"]
  },
  {
    id: 2,
    name: "Study Buddies",
    description: "Collaborative learning group for academic support and study sessions.",
    memberCount: 890,
    icon: BookIcon,
    tags: ["Academics", "Learning", "Support"]
  },
  {
    id: 3,
    name: "Global Networkers",
    description: "Build international connections and explore global opportunities.",
    memberCount: 1567,
    icon: GlobeIcon,
    tags: ["Networking", "International", "Career"]
  },
  {
    id: 4,
    name: "Student Wellness",
    description: "Community focused on mental health, fitness, and personal growth.",
    memberCount: 672,
    icon: UserIcon,
    tags: ["Wellness", "Health", "Personal Development"]
  }
];

export default function CommunityPage() {
  const [joinedCommunities, setJoinedCommunities] = useState<number[]>([]);

  const handleJoinCommunity = (communityId: number) => {
    if (!joinedCommunities.includes(communityId)) {
      setJoinedCommunities(prev => [...prev, communityId]);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6 text-gray-800">
        Student Communities
      </h1>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {initialCommunities.map((community) => {
          const isJoined = joinedCommunities.includes(community.id);
          const Icon = community.icon;

          return (
            <div 
              key={community.id} 
              className={`
                border rounded-lg p-6 transition-all duration-300 
                ${isJoined 
                  ? 'bg-green-50 border-green-200' 
                  : 'bg-white hover:shadow-lg hover:border-blue-200'
                }
              `}
            >
              <div className="flex items-center mb-4">
                <Icon />
                <h2 className="text-2xl font-semibold ml-4">{community.name}</h2>
              </div>
              
              <p className="text-gray-600 mb-4">{community.description}</p>
              
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center text-gray-500">
                  <UserIcon />
                  <span className="ml-2">{community.memberCount} Members</span>
                </div>
                
                <div className="flex space-x-2">
                  {community.tags.map((tag) => (
                    <span 
                      key={tag} 
                      className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <button 
                onClick={() => handleJoinCommunity(community.id)}
                disabled={isJoined}
                className={`
                  w-full flex items-center justify-center py-2 rounded-lg transition 
                  ${isJoined 
                    ? 'bg-green-500 text-white cursor-default' 
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                  }
                `}
              >
                <PlusIcon />
                <span className="ml-2">{isJoined ? 'Joined' : 'Join Community'}</span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}