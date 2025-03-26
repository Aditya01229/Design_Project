// src/app/components/ClientOnlyNavbar.tsx
"use client";

import dynamic from "next/dynamic";

// Use a different variable name, e.g. DynamicNavbar
const DynamicNavbar = dynamic(() => import("./Navbar"), { ssr: false });

export default function ClientOnlyNavbar() {
  return <DynamicNavbar />;
}
