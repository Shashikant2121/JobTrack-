const JobCard = ({ job, onEdit, onDelete }) => {
  const statusStyles = {
    Applied: "bg-blue-50 text-blue-700 border-blue-200",
    Interview: "bg-purple-50 text-purple-700 border-purple-200",
    Offer: "bg-green-50 text-green-700 border-green-200",
    Rejected: "bg-red-50 text-red-700 border-red-200",
  };

  const formattedDate = job.appliedDate
    ? new Date(job.appliedDate).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "—";

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
      {/* Header */}

      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-lg font-bold text-indigo-600">
            {job.company?.charAt(0)?.toUpperCase() || "C"}
          </div>

          <div>
            <h3 className="font-bold text-slate-900">{job.company}</h3>

            <p className="text-sm text-slate-500">{job.position}</p>
          </div>
        </div>

        <span
          className={`rounded-full border px-3 py-1 text-xs font-semibold ${
            statusStyles[job.status] ||
            "border-slate-200 bg-slate-50 text-slate-600"
          }`}
        >
          {job.status || "Applied"}
        </span>
      </div>

      {/* Details */}

      <div className="mt-5 grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-slate-50 p-3">
          <p className="text-xs text-slate-400">Location</p>

          <p className="mt-1 truncate text-sm font-medium text-slate-700">
            {job.location || "Not specified"}
          </p>
        </div>

        <div className="rounded-xl bg-slate-50 p-3">
          <p className="text-xs text-slate-400">Applied</p>

          <p className="mt-1 text-sm font-medium text-slate-700">
            {formattedDate}
          </p>
        </div>

        <div className="rounded-xl bg-slate-50 p-3">
          <p className="text-xs text-slate-400">Job Type</p>

          <p className="mt-1 truncate text-sm font-medium text-slate-700">
            {job.jobType || "Not specified"}
          </p>
        </div>

        <div className="rounded-xl bg-slate-50 p-3">
          <p className="text-xs text-slate-400">Work Mode</p>

          <p className="mt-1 truncate text-sm font-medium text-slate-700">
            {job.workMode || "Not specified"}
          </p>
        </div>
      </div>

      {/* Salary */}

      {job.salary && (
        <div className="mt-4 rounded-xl border border-green-100 bg-green-50 p-3">
          <p className="text-xs text-green-600">Salary</p>

          <p className="mt-1 text-sm font-semibold text-green-700">
            {job.salary}
          </p>
        </div>
      )}

      {/* Interview Date */}

      {job.interviewDate && (
        <div className="mt-3 rounded-xl border border-purple-100 bg-purple-50 p-3">
          <p className="text-xs text-purple-600">Interview Date</p>

          <p className="mt-1 text-sm font-semibold text-purple-700">
            {new Date(job.interviewDate).toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </p>
        </div>
      )}

      {/* Job URL */}

      {job.jobUrl && (
        <a
          href={job.jobUrl}
          target="_blank"
          rel="noreferrer"
          className="mt-4 block rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-3 text-center text-sm font-semibold text-indigo-600 transition hover:bg-indigo-100"
        >
          View Job Posting ↗
        </a>
      )}

      {/* Notes */}

      {job.notes && (
        <div className="mt-4">
          <p className="mb-1 text-xs font-medium text-slate-400">Notes</p>

          <p className="line-clamp-3 text-sm leading-6 text-slate-600">
            {job.notes}
          </p>
        </div>
      )}

      {/* Actions */}

      <div className="mt-5 flex gap-3 border-t border-slate-100 pt-4">
        <button
          onClick={() => onEdit(job)}
          className="flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          ✏️ Edit
        </button>

        <button
          onClick={() => onDelete(job._id)}
          className="flex-1 rounded-xl border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50"
        >
          🗑️ Delete
        </button>
      </div>
    </div>
  );
};

export default JobCard;
