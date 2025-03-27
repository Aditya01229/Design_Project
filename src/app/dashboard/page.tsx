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
  const [appliedJobs, setAppliedJobs] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch all data (User, Events, Jobs)
  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (!token) return router.push("/login");

      try {
        const decoded: { userId: string } = jwtDecode(token);
        const userRes = await fetch(`/api/user/${decoded.userId}`);
        const userData = await userRes.json();
        setUser(userData);

        const [eventRes, jobRes] = await Promise.all([
          fetch("/api/events"),
          fetch("/api/jobs"),
        ]);
        const eventData = await eventRes.json();
        const jobData = await jobRes.json();

        setEvents(Array.isArray(eventData) ? eventData : []);
        setJobs(Array.isArray(jobData) ? jobData : []);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter jobs posted by the alumni
  useEffect(() => {
    if (user?.userType === "ALUMNI") {
      setMyJobs(jobs.filter((job) => String(job.postedById) === String(user.id)));
    }
  }, [user, jobs]);

  // Fetch applied jobs for students
  useEffect(() => {
    if (user?.userType === "STUDENT") {
      fetch(`/api/applied/${user.id}`)
        .then((res) => res.json())
        .then((data) => {
          setAppliedJobs(data.map((app: { jobId: string }) => app.jobId));
        })
        .catch((err) => console.error("Error fetching applied jobs:", err));
    }
  }, [user]);

  const handlePostJob = () => router.push("/post-job");

  const handleApplyJob = async (jobId: string) => {
    if (!user) return;
    try {
      const res = await fetch("/api/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, jobId }),
      });

      if (res.ok) setAppliedJobs((prev) => [...prev, jobId]);
      else console.error("Error applying for job:", await res.json());
    } catch (error) {
      console.error("Error applying for job:", error);
    }
  };

  const handleDownloadApplications = async (jobId: string) => {
    try {
      const res = await fetch(`/api/download-applications?jobId=${jobId}`);
      if (!res.ok) throw new Error("Failed to download applications");

      const blob = await res.blob();
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

  if (loading) return <p className="text-center mt-10 text-gray-700">Loading...</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-blue-600">Welcome, {user?.fullName} 👋</h1>

      {user?.userType === "ALUMNI" && (
        <div className="mb-6 flex justify-end">
          <button onClick={handlePostJob} className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition">
            ➕ Post a Job
          </button>
        </div>
      )}

      <Section title="🎉 Upcoming Events">
        {events.length > 0 ? (
          events.map((event) => (
            <Card key={event.id} title={event.title} description={event.description} footer={new Date(event.date).toLocaleDateString()} />
          ))
        ) : (
          <p className="text-gray-500">No upcoming events.</p>
        )}
      </Section>

      <Section title="💼 Latest Job Openings">
        {jobs.length > 0 ? (
          jobs.map((job) => (
            <Card key={job.id} title={`${job.title} - ${job.company}`} description={job.description} footer={job.location}>
              {user?.userType === "STUDENT" &&
                (appliedJobs.includes(job.id) ? (
                  <DisabledButton text="Applied" />
                ) : (
                  <ActionButton text="✅ Apply for Job" onClick={() => handleApplyJob(job.id)} />
                ))}
            </Card>
          ))
        ) : (
          <p className="text-gray-500">No job openings available.</p>
        )}
      </Section>

      {user?.userType === "ALUMNI" && (
        <Section title="📌 Your Posted Jobs">
          {myJobs.length > 0 ? (
            myJobs.map((job) => (
              <Card key={job.id} title={`${job.title} - ${job.company}`} description={job.description} footer={job.location}>
                <ActionButton text="📥 Download Excel" onClick={() => handleDownloadApplications(job.id)} />
              </Card>
            ))
          ) : (
            <p className="text-gray-500">You haven&apos;t posted any jobs yet.</p>
          )}
        </Section>
      )}
    </div>
  );
}

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className="bg-white shadow-lg p-6 rounded-lg mb-6">
    <h2 className="text-xl font-semibold mb-4 text-gray-800">{title}</h2>
    <div className="space-y-4">{children}</div>
  </section>
);

const Card = ({ title, description, footer, children }: { title: string; description: string; footer?: string; children?: React.ReactNode }) => (
  <div className="p-4 border rounded-lg shadow hover:shadow-md transition">
    <h3 className="font-bold text-lg">{title}</h3>
    <p className="text-gray-600 text-sm">{description}</p>
    {footer && <p className="text-gray-500 text-sm mt-2">{footer}</p>}
    {children && <div className="mt-3">{children}</div>}
  </div>
);

const ActionButton = ({ text, onClick }: { text: string; onClick: () => void }) => (
  <button onClick={onClick} className="px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition">
    {text}
  </button>
);

const DisabledButton = ({ text }: { text: string }) => (
  <button disabled className="px-4 py-2 bg-gray-400 text-white font-semibold rounded-lg cursor-not-allowed transition">
    {text}
  </button>
);
