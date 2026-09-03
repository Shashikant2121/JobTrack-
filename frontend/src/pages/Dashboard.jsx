import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

const Dashboard = () => {
  const { user, logout } = useAuth();

  const [stats, setStats] = useState({
    totalApplications: 0,
    interviews: 0,
    offers: 0,
    rejections: 0,
  });

  const [analytics, setAnalytics] = useState({
    totalApplications: 0,
    statusCounts: {
      Applied: 0,
      Interview: 0,
      Offer: 0,
      Rejected: 0,
    },
    interviewRate: 0,
    offerRate: 0,
    recentApplications: [],
  });

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  // =====================================
  // FETCH DASHBOARD DATA
  // =====================================

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        setError("");

        const [statsResponse, analyticsResponse] = await Promise.all([
          api.get("/jobs/stats"),
          api.get("/jobs/analytics"),
        ]);

        if (statsResponse.data.success) {
          setStats(statsResponse.data.stats);
        }

        if (analyticsResponse.data.success) {
          setAnalytics(analyticsResponse.data.analytics);
        }
      } catch (error) {
        console.error("Dashboard Error:", error);

        setError(
          error.response?.data?.message || "Unable to load dashboard data",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  const statusCounts = analytics.statusCounts || {};

  const totalApplications = analytics.totalApplications ?? 0;

  const applied = statusCounts.Applied ?? 0;
  const interviews = statusCounts.Interview ?? 0;
  const offers = statusCounts.Offer ?? 0;
  const rejected = statusCounts.Rejected ?? 0;

  // =====================================
  // STATUS BAR CALCULATION
  // =====================================

  const getPercentage = (value) => {
    if (totalApplications === 0) return 0;

    return Math.round((value / totalApplications) * 100);
  };

  // =====================================
  // DATE FORMAT
  // =====================================

  const formatDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* =====================================
          NAVBAR
      ===================================== */}

      <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          {/* LOGO */}

          <Link to="/dashboard" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 font-bold text-white shadow-sm">
              J
            </div>

            <div>
              <h1 className="font-bold text-slate-900">JobTrack</h1>

              <p className="hidden text-xs text-slate-500 sm:block">
                Career dashboard
              </p>
            </div>
          </Link>

          {/* DESKTOP NAV */}

          <div className="hidden items-center gap-2 md:flex">
            <Link
              to="/dashboard"
              className="rounded-lg bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-600"
            >
              Dashboard
            </Link>

            <Link
              to="/applications"
              className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
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

          {/* USER */}

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
              className="hidden rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 md:block"
            >
              Logout
            </button>
          </div>
        </div>

        {/* MOBILE NAV */}

        <div className="border-t border-slate-100 px-4 py-2 md:hidden">
          <div className="flex gap-2 overflow-x-auto">
            <Link
              to="/dashboard"
              className="whitespace-nowrap rounded-lg bg-indigo-50 px-3 py-2 text-sm font-semibold text-indigo-600"
            >
              Dashboard
            </Link>

            <Link
              to="/applications"
              className="whitespace-nowrap rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-100"
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

      {/* =====================================
          MAIN
      ===================================== */}

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* HEADER */}

        <div className="mb-8">
          <p className="mb-1 text-sm font-semibold text-indigo-600">
            Welcome back 👋
          </p>

          <h2 className="text-3xl font-bold tracking-tight text-slate-900">
            {user?.name ? `Hello, ${user.name}` : "Your Job Dashboard"}
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Keep track of your applications and monitor your job search
            progress.
          </p>
        </div>

        {/* ERROR */}

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* =====================================
            STAT CARDS
        ===================================== */}

        <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard
            title="Total Applications"
            value={stats.totalApplications ?? 0}
            icon="📋"
          />

          <StatCard
            title="Interviews"
            value={stats.interviews ?? 0}
            icon="🎯"
          />

          <StatCard title="Offers" value={stats.offers ?? 0} icon="🎉" />

          <StatCard title="Rejected" value={stats.rejections ?? 0} icon="❌" />
        </div>

        {/* =====================================
            LOADING
        ===================================== */}

        {loading ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-16 text-center shadow-sm">
            <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-600" />

            <p className="font-medium text-slate-700">Loading dashboard...</p>
          </div>
        ) : (
          <>
            {/* =====================================
                ANALYTICS GRID
            ===================================== */}

            <div className="mb-8 grid gap-6 lg:grid-cols-2">
              {/* STATUS DISTRIBUTION */}

              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-slate-900">
                    Application Status
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    Distribution of your applications
                  </p>
                </div>

                <div className="space-y-5">
                  <StatusProgress
                    label="Applied"
                    value={applied}
                    percentage={getPercentage(applied)}
                    icon="📨"
                  />

                  <StatusProgress
                    label="Interview"
                    value={interviews}
                    percentage={getPercentage(interviews)}
                    icon="🎯"
                  />

                  <StatusProgress
                    label="Offer"
                    value={offers}
                    percentage={getPercentage(offers)}
                    icon="🎉"
                  />

                  <StatusProgress
                    label="Rejected"
                    value={rejected}
                    percentage={getPercentage(rejected)}
                    icon="❌"
                  />
                </div>
              </div>

              {/* PERFORMANCE */}

              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-slate-900">
                    Application Performance
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    Track your conversion rates
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  {/* INTERVIEW */}

                  <div className="rounded-2xl bg-purple-50 p-5">
                    <div className="mb-4 flex items-center justify-between">
                      <span className="text-2xl">🎯</span>

                      <span className="text-2xl font-bold text-purple-700">
                        {analytics.interviewRate ?? 0}%
                      </span>
                    </div>

                    <h4 className="font-semibold text-purple-900">
                      Interview Rate
                    </h4>

                    <p className="mt-1 text-xs text-purple-600">
                      Applications reaching interview stage
                    </p>
                  </div>

                  {/* OFFER */}

                  <div className="rounded-2xl bg-green-50 p-5">
                    <div className="mb-4 flex items-center justify-between">
                      <span className="text-2xl">🎉</span>

                      <span className="text-2xl font-bold text-green-700">
                        {analytics.offerRate ?? 0}%
                      </span>
                    </div>

                    <h4 className="font-semibold text-green-900">Offer Rate</h4>

                    <p className="mt-1 text-xs text-green-600">
                      Applications resulting in offers
                    </p>
                  </div>
                </div>

                {/* FUNNEL */}

                <div className="mt-6">
                  <h4 className="mb-4 text-sm font-bold text-slate-900">
                    Application Funnel
                  </h4>

                  <div className="flex items-center gap-2">
                    <FunnelItem label="Applied" value={applied} />

                    <span className="text-slate-300">→</span>

                    <FunnelItem label="Interview" value={interviews} />

                    <span className="text-slate-300">→</span>

                    <FunnelItem label="Offer" value={offers} />
                  </div>
                </div>
              </div>
            </div>

            {/* =====================================
                RECENT APPLICATIONS
            ===================================== */}

            <div className="mb-8 rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    Recent Applications
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    Your latest job applications
                  </p>
                </div>

                <Link
                  to="/applications"
                  className="text-sm font-semibold text-indigo-600 hover:text-indigo-700"
                >
                  View All →
                </Link>
              </div>

              {analytics.recentApplications?.length > 0 ? (
                <div className="divide-y divide-slate-100">
                  {analytics.recentApplications.map((job) => (
                    <div
                      key={job._id}
                      className="flex flex-col gap-4 px-6 py-5 transition hover:bg-slate-50 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 font-bold text-indigo-600">
                          {job.company?.charAt(0)?.toUpperCase() || "C"}
                        </div>

                        <div>
                          <h4 className="font-semibold text-slate-900">
                            {job.position}
                          </h4>

                          <p className="text-sm text-slate-500">
                            {job.company}
                            {job.location && ` • ${job.location}`}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-left sm:text-right">
                          <StatusBadge status={job.status} />

                          <p className="mt-1 text-xs text-slate-400">
                            {formatDate(job.appliedDate)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="px-6 py-12 text-center">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-2xl">
                    📋
                  </div>

                  <h4 className="font-bold text-slate-900">
                    No applications yet
                  </h4>

                  <p className="mt-1 text-sm text-slate-500">
                    Start tracking your job search today.
                  </p>

                  <Link
                    to="/applications"
                    className="mt-5 inline-block rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-700"
                  >
                    Add Application
                  </Link>
                </div>
              )}
            </div>

            {/* =====================================
                QUICK ACTIONS
            ===================================== */}

            <div className="grid gap-4 md:grid-cols-2">
              <Link
                to="/applications"
                className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-2xl">
                  ➕
                </div>

                <h3 className="font-bold text-slate-900">
                  Add New Application
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Track a new job opportunity.
                </p>

                <p className="mt-4 text-sm font-semibold text-indigo-600">
                  Add Application →
                </p>
              </Link>

              <Link
                to="/resume"
                className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-purple-50 text-2xl">
                  📄
                </div>

                <h3 className="font-bold text-slate-900">
                  Analyze Your Resume
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Get AI-powered resume feedback.
                </p>

                <p className="mt-4 text-sm font-semibold text-purple-600">
                  Analyze Resume →
                </p>
              </Link>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

// ============================================
// STAT CARD
// ============================================

const StatCard = ({ title, value, icon }) => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm font-medium text-slate-500">{title}</p>

        <span className="text-xl">{icon}</span>
      </div>

      <p className="text-3xl font-bold text-slate-900">{value}</p>
    </div>
  );
};

// ============================================
// STATUS PROGRESS
// ============================================

const StatusProgress = ({ label, value, percentage, icon }) => {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span>{icon}</span>

          <span className="text-sm font-medium text-slate-700">{label}</span>
        </div>

        <span className="text-sm font-semibold text-slate-900">
          {value}{" "}
          <span className="font-normal text-slate-400">({percentage}%)</span>
        </span>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-indigo-600 transition-all duration-700"
          style={{
            width: `${percentage}%`,
          }}
        />
      </div>
    </div>
  );
};

// ============================================
// FUNNEL ITEM
// ============================================

const FunnelItem = ({ label, value }) => {
  return (
    <div className="flex-1 rounded-xl bg-slate-50 px-3 py-3 text-center">
      <p className="text-lg font-bold text-slate-900">{value}</p>

      <p className="text-xs text-slate-500">{label}</p>
    </div>
  );
};

// ============================================
// STATUS BADGE
// ============================================

const StatusBadge = ({ status }) => {
  const styles = {
    Applied: "bg-blue-50 text-blue-700 border-blue-200",

    Interview: "bg-purple-50 text-purple-700 border-purple-200",

    Offer: "bg-green-50 text-green-700 border-green-200",

    Rejected: "bg-red-50 text-red-700 border-red-200",
  };

  return (
    <span
      className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${
        styles[status] || "border-slate-200 bg-slate-50 text-slate-600"
      }`}
    >
      {status || "Applied"}
    </span>
  );
};

export default Dashboard;
