"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    graduationYear: "",
    language: "",
    linkedin: "",
    skills: "",
    userType: "STUDENT",
    company: "",
    location: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.message);
      return;
    }

    router.push("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-semibold text-center">Sign Up</h2>
        {error && <p className="text-red-500 text-sm text-center mt-2">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <input type="text" name="fullName" placeholder="Full Name" required className="w-full p-2 border rounded" onChange={handleChange} />
          <input type="email" name="email" placeholder="Email" required className="w-full p-2 border rounded" onChange={handleChange} />
          <input type="text" name="phone" placeholder="Phone" required className="w-full p-2 border rounded" onChange={handleChange} />
          <input type="text" name="graduationYear" placeholder="Graduation Year" className="w-full p-2 border rounded" onChange={handleChange} />
          <input type="text" name="language" placeholder="Preferred Language" className="w-full p-2 border rounded" onChange={handleChange} />
          <input type="text" name="linkedin" placeholder="LinkedIn URL" className="w-full p-2 border rounded" onChange={handleChange} />
          <input type="text" name="skills" placeholder="Skills" className="w-full p-2 border rounded" onChange={handleChange} />

          {/* User Type Dropdown */}
          <select name="userType" className="w-full p-2 border rounded" onChange={handleChange}>
            <option value="STUDENT">Student</option>
            <option value="ALUMNI">Alumni</option>
          </select>

          {/* Show only if Alumni is selected */}
          {formData.userType === "ALUMNI" && (
            <>
              <input type="text" name="company" placeholder="Company" required className="w-full p-2 border rounded" onChange={handleChange} />
              <input type="text" name="location" placeholder="Location" required className="w-full p-2 border rounded" onChange={handleChange} />
            </>
          )}

          <input type="password" name="password" placeholder="Password" required className="w-full p-2 border rounded" onChange={handleChange} />
          <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600" disabled={loading}>
            {loading ? "Signing up..." : "Sign Up"}
          </button>
        </form>
        <p className="text-sm text-center mt-2">
          Already have an account? <a href="/login" className="text-blue-500">Login</a>
        </p>
      </div>
    </div>
  );
}
