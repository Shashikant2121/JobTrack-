import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import JobForm from "../components/JobForm";
import JobCard from "../components/JobCard";

const Applications = () => {
  const { user, logout } = useAuth();

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [editingJob, setEditingJob] = useState(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [error, setError] = useState("");

  // ==============================
  // FETCH APPLICATIONS
  // ==============================

  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/jobs");

      if (response.data.success) {
        setJobs(response.data.jobs || []);
      }
    } catch (error) {
      console.error("Fetch Jobs Error:", error);

      setError(error.response?.data?.message || "Unable to load applications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  // ==============================
  // ADD APPLICATION
  // ==============================

  const handleAddJob = async (formData) => {
    try {
      const response = await api.post("/jobs", formData);

      if (response.data.success) {
        setJobs((prev) => [response.data.job, ...prev]);

        setShowForm(false);
      }
    } catch (error) {
      console.error("Add Job Error:", error);

      alert(error.response?.data?.message || "Failed to add application");
    }
  };

  // ==============================
  // UPDATE APPLICATION
  // ==============================

  const handleUpdateJob = async (formData) => {
    try {
      const response = await api.put(`/jobs/${editingJob._id}`, formData);

      if (response.data.success) {
        setJobs((prev) =>
          prev.map((job) =>
            job._id === editingJob._id ? response.data.job : job,
          ),
        );

        setEditingJob(null);
        setShowForm(false);
      }
    } catch (error) {
      console.error("Update Job Error:", error);

      alert(error.response?.data?.message || "Failed to update application");
    }
  };

  // ==============================
  // DELETE APPLICATION
  // ==============================

  const handleDeleteJob = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this application?",
    );

    if (!confirmed) return;

    try {
      const response = await api.delete(`/jobs/${id}`);

      if (response.data.success) {
        setJobs((prev) => prev.filter((job) => job._id !== id));
      }
    } catch (error) {
      console.error("Delete Job Error:", error);

      alert(error.response?.data?.message || "Failed to delete application");
    }
  };

  // ==============================
  // EDIT
  // ==============================

  const handleEditJob = (job) => {
    setEditingJob(job);
    setShowForm(true);
  };

  // ==============================
  // FILTER APPLICATIONS
  // ==============================

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const searchText = search.toLowerCase();

      const matchesSearch =
        job.company?.toLowerCase().includes(searchText) ||
        job.position?.toLowerCase().includes(searchText) ||
        job.location?.toLowerCase().includes(searchText);

      const matchesStatus =
        statusFilter === "All" || job.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [jobs, search, statusFilter]);

  // ==============================
  // STATS
  // ==============================

  const total = jobs.length;

  const applied = jobs.filter((job) => job.status === "Applied").length;

  const interviews = jobs.filter((job) => job.status === "Interview").length;

  const offers = jobs.filter((job) => job.status === "Offer").length;

  const rejected = jobs.filter((job) => job.status === "Rejected").length;

  // ==============================
  // FORM SUBMIT
  // ==============================

  const handleFormSubmit = (formData) => {
    if (editingJob) {
      handleUpdateJob(formData);
    } else {
      handleAddJob(formData);
    }
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingJob(null);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* ================= NAVBAR ================= */}

      <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          {/* Logo */}

          <Link to="/dashboard" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 font-bold text-white shadow-sm">
              J
            </div>

            <div>
              <h1 className="text-lg font-bold text-slate-900">JobTrack</h1>

              <p className="hidden text-xs text-slate-500 sm:block">
                Career dashboard
              </p>
            </div>
          </Link>

          {/* Navigation */}

          <div className="hidden items-center gap-2 md:flex">
            <Link
              to="/dashboard"
              className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
            >
              Dashboard
            </Link>

            <Link
              to="/applications"
              className="rounded-lg bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-600"
            >
              Applications
            </Link>

            <Link
              to="/resume"
              className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
            >
              Resume Analyzer
            </Link>
          </div>

          {/* User */}

          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold text-slate-900">
                {user?.name || "User"}
              </p>

              <p className="text-xs text-slate-500">Job Seeker</p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 font-bold text-indigo-600">
              {user?.name?.charAt(0)?.toUpperCase() || "U"}
            </div>

            <button
              onClick={logout}
              className="hidden rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 md:block"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}

        <div className="border-t border-slate-100 px-4 py-2 md:hidden">
          <div className="flex gap-2 overflow-x-auto">
            <Link
              to="/dashboard"
              className="whitespace-nowrap rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-100"
            >
              Dashboard
            </Link>

            <Link
              to="/applications"
              className="whitespace-nowrap rounded-lg bg-indigo-50 px-3 py-2 text-sm font-semibold text-indigo-600"
            >
              Applications
            </Link>

            <Link
              to="/resume"
              className="whitespace-nowrap rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-100"
            >
              Resume Analyzer
            </Link>

            <button
              onClick={logout}
              className="whitespace-nowrap rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-red-50"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* ================= MAIN ================= */}

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* HEADER */}

        <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="mb-1 text-sm font-medium text-indigo-600">
              Job Applications
            </p>

            <h2 className="text-3xl font-bold tracking-tight text-slate-900">
              Track your applications
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Manage and monitor your entire job search in one place.
            </p>
          </div>

          <button
            onClick={() => {
              setEditingJob(null);
              setShowForm(true);
            }}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
          >
            <span className="text-lg">+</span>
            Add Application
          </button>
        </div>

        {/* ================= STATS ================= */}

        <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-5">
          <StatCard title="Total" value={total} icon="📋" />

          <StatCard title="Applied" value={applied} icon="📨" />

          <StatCard title="Interviews" value={interviews} icon="🎯" />

          <StatCard title="Offers" value={offers} icon="🎉" />

          <StatCard title="Rejected" value={rejected} icon="❌" />
        </div>

        {/* ================= SEARCH / FILTER ================= */}

        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row">
            {/* Search */}

            <div className="relative flex-1">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                🔍
              </span>

              <input
                type="text"
                placeholder="Search company, position or location..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            {/* Status */}

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            >
              <option value="All">All Status</option>
              <option value="Applied">Applied</option>
              <option value="Interview">Interview</option>
              <option value="Offer">Offer</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          <div className="mt-3 flex items-center justify-between">
            <p className="text-sm text-slate-500">
              Showing{" "}
              <span className="font-semibold text-slate-700">
                {filteredJobs.length}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-slate-700">
                {jobs.length}
              </span>{" "}
              applications
            </p>

            {(search || statusFilter !== "All") && (
              <button
                onClick={() => {
                  setSearch("");
                  setStatusFilter("All");
                }}
                className="text-sm font-semibold text-indigo-600 hover:text-indigo-700"
              >
                Clear filters
              </button>
            )}
          </div>
        </div>

        {/* ================= ERROR ================= */}

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* ================= LOADING ================= */}

        {loading ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">
            <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-600" />

            <p className="font-medium text-slate-700">
              Loading applications...
            </p>
          </div>
        ) : filteredJobs.length === 0 ? (
          /* ================= EMPTY ================= */

          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-3xl">
              📋
            </div>

            <h3 className="text-xl font-bold text-slate-900">
              {jobs.length === 0
                ? "No applications yet"
                : "No matching applications"}
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
              {jobs.length === 0
                ? "Start tracking your job search by adding your first application."
                : "Try changing your search or status filter."}
            </p>

            {jobs.length === 0 && (
              <button
                onClick={() => setShowForm(true)}
                className="mt-6 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-700"
              >
                Add Your First Application
              </button>
            )}
          </div>
        ) : (
          <>
            {/* ================= DESKTOP ================= */}

            <div className="hidden overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm lg:block">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b border-slate-200 bg-slate-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Company
                      </th>

                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Position
                      </th>

                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Location
                      </th>

                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Status
                      </th>

                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Applied
                      </th>

                      <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {filteredJobs.map((job) => (
                      <ApplicationRow
                        key={job._id}
                        job={job}
                        onEdit={handleEditJob}
                        onDelete={handleDeleteJob}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* ================= MOBILE ================= */}

            <div className="grid gap-4 lg:hidden">
              {filteredJobs.map((job) => (
                <JobCard
                  key={job._id}
                  job={job}
                  onEdit={handleEditJob}
                  onDelete={handleDeleteJob}
                />
              ))}
            </div>
          </>
        )}
      </main>

      {/* ================= FORM MODAL ================= */}

      {showForm && (
        <div className="fixed inset-0  flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <div className="max-h-[95vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  {editingJob ? "Edit Application" : "Add Application"}
                </h3>

                <p className="text-xs text-slate-500">
                  Keep your job search organized.
                </p>
              </div>

              <button
                onClick={closeForm}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-xl text-slate-500 hover:bg-slate-100 hover:text-slate-800"
              >
                ×
              </button>
            </div>

            <div className="p-6">
              <JobForm
                editingJob={editingJob}
                onSubmit={handleFormSubmit}
                onClose={closeForm}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================
// STAT CARD
// ============================================

const StatCard = ({ title, value, icon }) => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm font-medium text-slate-500">{title}</p>

        <span className="text-xl">{icon}</span>
      </div>

      <p className="text-2xl font-bold text-slate-900">{value}</p>
    </div>
  );
};

// ============================================
// DESKTOP APPLICATION ROW
// ============================================

const ApplicationRow = ({ job, onEdit, onDelete }) => {
  const statusStyles = {
    Applied: "bg-blue-50 text-blue-700 border-blue-200",

    Interview: "bg-purple-50 text-purple-700 border-purple-200",

    Offer: "bg-green-50 text-green-700 border-green-200",

    Rejected: "bg-red-50 text-red-700 border-red-200",
  };

  return (
    <tr className="transition hover:bg-slate-50">
      {/* Company */}

      <td className="px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 font-bold text-indigo-600">
            {job.company?.charAt(0)?.toUpperCase() || "C"}
          </div>

          <div>
            <p className="font-semibold text-slate-900">{job.company}</p>

            {job.jobUrl && (
              <a
                href={job.jobUrl}
                target="_blank"
                rel="noreferrer"
                className="text-xs font-medium text-indigo-600 hover:underline"
              >
                View Job ↗
              </a>
            )}
          </div>
        </div>
      </td>

      {/* Position */}

      <td className="px-6 py-5">
        <p className="font-medium text-slate-800">{job.position}</p>

        {job.jobType && (
          <p className="mt-1 text-xs text-slate-500">
            {job.jobType}
            {job.workMode && ` • ${job.workMode}`}
          </p>
        )}
      </td>

      {/* Location */}

      <td className="px-6 py-5 text-sm text-slate-600">
        {job.location || "—"}
      </td>

      {/* Status */}

      <td className="px-6 py-5">
        <span
          className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${
            statusStyles[job.status] ||
            "bg-slate-50 text-slate-600 border-slate-200"
          }`}
        >
          {job.status || "Applied"}
        </span>
      </td>

      {/* Applied Date */}

      <td className="px-6 py-5 text-sm text-slate-600">
        {job.appliedDate
          ? new Date(job.appliedDate).toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })
          : "—"}
      </td>

      {/* Actions */}

      <td className="px-6 py-5">
        <div className="flex justify-end gap-2">
          <button
            onClick={() => onEdit(job)}
            className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100"
          >
            Edit
          </button>

          <button
            onClick={() => onDelete(job._id)}
            className="rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50"
          >
            Delete
          </button>
        </div>
      </td>
    </tr>
  );
};

export default Applications;
