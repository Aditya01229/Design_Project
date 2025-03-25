"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode"; // Install via `npm install jwt-decode`

// User Type Definition
interface User {
  id: string;
  fullName: string;
  email: string;
  userType: "STUDENT" | "ALUMNI";
}

// Event Type Definition
interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
}

// Job Type Definition
interface Job {
  id: string;
  title: string;
  company: string;
  description: string;
  location: string;
  postedById: string; // Alumni ID who posted the job
}

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [myJobs, setMyJobs] = useState<Job[]>([]);
  const [appliedJobs, setAppliedJobs] = useState<string[]>([]); // Track job IDs applied for
  const [loading, setLoading] = useState(true);

  // Fetch User, Events, and Jobs
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }
    try {
      const decoded: { userId: string } = jwtDecode(token);
      fetch(`/api/user/${decoded.userId}`)
        .then((res) => res.json())
        .then((data) => {
          setUser(data); // Set user first
          return Promise.all([
            fetch("/api/events").then((res) => res.json()),
            fetch("/api/jobs").then((res) => res.json()),
          ]);
        })
        .then(([eventData, jobData]) => {
          setEvents(eventData);
          setJobs(jobData);
        })
        .catch((err) => console.error("Error fetching data:", err))
        .finally(() => setLoading(false));
    } catch (error) {
      console.error("Invalid token:", error);
      router.push("/login");
    }
  }, []);

  // Filter jobs posted by Alumni after user & jobs are set
  useEffect(() => {
    if (!user) return;
    const filteredJobs = jobs.filter(
      (job) => String(job.postedById) === String(user.id)
    );
    setMyJobs(filteredJobs);
  }, [user, jobs]);

  // Fetch applied jobs for the student (if user is a STUDENT)
  useEffect(() => {
    if (user && user.userType === "STUDENT") {
      fetch(`/api/applied/${user.id}`)
        .then((res) => res.json())
        .then((data) => {
          // Assume data is an array of job application objects with a jobId field
          const appliedIds = data.map((app: { jobId: string }) => app.jobId);
          setAppliedJobs(appliedIds);
        })
        .catch((err) => console.error("Error fetching applied jobs:", err));
    }
  }, [user]);

  const handlePostJob = () => {
    router.push("/post-job"); // Redirect to a job posting page
  };

  // Function for students to apply for a job
  const handleApplyJob = async (jobId: string) => {
    if (!user) return;
    try {
      const response = await fetch("/api/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, jobId }),
      });
      const data = await response.json();
      if (response.ok) {
        // Smoothly update the UI by updating the state
        setAppliedJobs((prev) => [...prev, jobId]);
      } else {
        console.error(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error("Error applying for job:", error);
    }
  };

  // Function for Alumni to download the list of applicants for a given job
  const handleDownloadApplications = async (jobId: string) => {
    try {
      const response = await fetch(`/api/download-applications?jobId=${jobId}`);
      if (!response.ok) {
        throw new Error("Failed to download applications");
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `applications-${jobId}.xlsx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading Excel:", error);
    }
  };

  if (loading) {
    return <p className="text-center mt-10 text-gray-700">Loading...</p>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <h1 className="text-3xl font-bold mb-6 text-blue-600">
        Welcome, {user?.fullName} 👋
      </h1>

      {/* Alumni Exclusive: Post Job Button */}
      {user?.userType === "ALUMNI" && (
        <div className="mb-6 flex justify-end">
          <button
            onClick={handlePostJob}
            className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
          >
            ➕ Post a Job
          </button>
        </div>
      )}

      {/* Events Section */}
      <section className="bg-white shadow-lg p-6 rounded-lg mb-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          🎉 Upcoming Events
        </h2>
        {events.length > 0 ? (
          <div className="space-y-4">
            {events.map((event) => (
              <div
                key={event.id}
                className="p-4 border rounded-lg shadow hover:shadow-md transition"
              >
                <h3 className="font-bold text-lg">{event.title}</h3>
                <p className="text-gray-600 text-sm">{event.description}</p>
                <p className="text-gray-500 text-sm mt-2">
                  {new Date(event.date).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No upcoming events.</p>
        )}
      </section>

      {/* Jobs Section */}
      <section className="bg-white shadow-lg p-6 rounded-lg mb-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          💼 Latest Job Openings
        </h2>
        {jobs.length > 0 ? (
          <div className="space-y-4">
            {jobs.map((job) => (
              <div
                key={job.id}
                className="p-4 border rounded-lg shadow hover:shadow-md transition"
              >
                <h3 className="font-bold text-lg">
                  {job.title} - {job.company}
                </h3>
                <p className="text-gray-600 text-sm">{job.description}</p>
                <p className="text-gray-500 text-sm mt-2">{job.location}</p>
                {/* Apply Button for Students */}
                {user?.userType === "STUDENT" && (
                  <>
                    {appliedJobs.includes(job.id) ? (
                      <button
                        disabled
                        className="mt-3 px-4 py-2 bg-gray-400 text-white font-semibold rounded-lg cursor-not-allowed transition"
                      >
                        Applied
                      </button>
                    ) : (
                      <button
                        onClick={() => handleApplyJob(job.id)}
                        className="mt-3 px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition"
                      >
                        ✅ Apply for Job
                      </button>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No job openings available.</p>
        )}
      </section>

      {/* Alumni Exclusive: My Posted Jobs Section */}
      {user?.userType === "ALUMNI" && (
        <section className="bg-white shadow-lg p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            📌 Your Posted Jobs
          </h2>
          {myJobs.length > 0 ? (
            <div className="space-y-4">
              {myJobs.map((job) => (
                <div
                  key={job.id}
                  className="p-4 border rounded-lg shadow hover:shadow-md transition flex flex-col gap-3"
                >
                  <div>
                    <h3 className="font-bold text-lg">
                      {job.title} - {job.company}
                    </h3>
                    <p className="text-gray-600 text-sm">{job.description}</p>
                    <p className="text-gray-500 text-sm mt-2">
                      {job.location}
                    </p>
                  </div>
                  <div className="flex gap-4">
                    {/* Download Excel Button */}
                    <button
                      onClick={() => handleDownloadApplications(job.id)}
                      className="px-4 py-2 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition"
                    >
                      📥 Download Excel
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">
              You haven&apos;t posted any jobs yet.
            </p>
          )}
        </section>
      )}
    </div>
  );
}
