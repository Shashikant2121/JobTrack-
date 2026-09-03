import { useEffect, useState } from "react";

const JobForm = ({ initialData, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    company: "",
    position: "",
    location: "",
    jobType: "Full Time",
    workMode: "Remote",
    salary: "",
    status: "Applied",
    appliedDate: "",
    interviewDate: "",
    jobUrl: "",
    notes: "",
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // ============================
  // EDIT DATA
  // ============================

  useEffect(() => {
    if (initialData) {
      setFormData({
        company: initialData.company || "",
        position: initialData.position || "",
        location: initialData.location || "",
        jobType: initialData.jobType || "Full Time",
        workMode: initialData.workMode || "Remote",
        salary: initialData.salary || "",
        status: initialData.status || "Applied",
        appliedDate: initialData.appliedDate
          ? initialData.appliedDate.split("T")[0]
          : "",
        interviewDate: initialData.interviewDate
          ? initialData.interviewDate.split("T")[0]
          : "",
        jobUrl: initialData.jobUrl || "",
        notes: initialData.notes || "",
      });
    }
  }, [initialData]);

  // ============================
  // INPUT CHANGE
  // ============================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  // ============================
  // VALIDATION
  // ============================

  const validate = () => {
    const newErrors = {};

    if (!formData.company.trim()) {
      newErrors.company = "Company name is required";
    }

    if (!formData.position.trim()) {
      newErrors.position = "Position is required";
    }

    if (formData.jobUrl && !/^https?:\/\/.+/i.test(formData.jobUrl)) {
      newErrors.jobUrl =
        "Please enter a valid URL starting with http:// or https://";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // ============================
  // SUBMIT
  // ============================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      setSubmitting(true);

      await onSubmit(formData);
    } catch (error) {
      console.error("Form Submit Error:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* ================= BASIC INFO ================= */}

      <div>
        <h4 className="mb-4 text-sm font-bold text-slate-900">
          Basic Information
        </h4>

        <div className="grid gap-4 sm:grid-cols-2">
          {/* Company */}

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Company *
            </label>

            <input
              type="text"
              name="company"
              value={formData.company}
              onChange={handleChange}
              placeholder="e.g. Google"
              className={`w-full rounded-xl border ${
                errors.company ? "border-red-400" : "border-slate-200"
              } bg-white px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100`}
            />

            {errors.company && (
              <p className="mt-1 text-xs text-red-500">{errors.company}</p>
            )}
          </div>

          {/* Position */}

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Position *
            </label>

            <input
              type="text"
              name="position"
              value={formData.position}
              onChange={handleChange}
              placeholder="e.g. Frontend Developer"
              className={`w-full rounded-xl border ${
                errors.position ? "border-red-400" : "border-slate-200"
              } bg-white px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100`}
            />

            {errors.position && (
              <p className="mt-1 text-xs text-red-500">{errors.position}</p>
            )}
          </div>

          {/* Location */}

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Location
            </label>

            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g. Bangalore, India"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          {/* Job Type */}

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Job Type
            </label>

            <select
              name="jobType"
              value={formData.jobType}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            >
              <option value="Full Time">Full Time</option>
              <option value="Part Time">Part Time</option>
              <option value="Internship">Internship</option>
              <option value="Contract">Contract</option>
              <option value="Freelance">Freelance</option>
            </select>
          </div>

          {/* Work Mode */}

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Work Mode
            </label>

            <select
              name="workMode"
              value={formData.workMode}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            >
              <option value="Remote">Remote</option>
              <option value="On-site">On-site</option>
              <option value="Hybrid">Hybrid</option>
            </select>
          </div>

          {/* Salary */}

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Salary
            </label>

            <input
              type="text"
              name="salary"
              value={formData.salary}
              onChange={handleChange}
              placeholder="e.g. ₹6 - ₹8 LPA"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </div>
        </div>
      </div>

      {/* ================= STATUS ================= */}

      <div>
        <h4 className="mb-4 text-sm font-bold text-slate-900">
          Application Status
        </h4>

        <div className="grid gap-4 sm:grid-cols-2">
          {/* Status */}

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Status
            </label>

            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            >
              <option value="Applied">Applied</option>
              <option value="Interview">Interview</option>
              <option value="Offer">Offer</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          {/* Applied Date */}

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Applied Date
            </label>

            <input
              type="date"
              name="appliedDate"
              value={formData.appliedDate}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          {/* Interview Date */}

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Interview Date
            </label>

            <input
              type="date"
              name="interviewDate"
              value={formData.interviewDate}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </div>
        </div>
      </div>

      {/* ================= JOB URL ================= */}

      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">
          Job Posting URL
        </label>

        <input
          type="url"
          name="jobUrl"
          value={formData.jobUrl}
          onChange={handleChange}
          placeholder="https://example.com/job"
          className={`w-full rounded-xl border ${
            errors.jobUrl ? "border-red-400" : "border-slate-200"
          } px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100`}
        />

        {errors.jobUrl && (
          <p className="mt-1 text-xs text-red-500">{errors.jobUrl}</p>
        )}
      </div>

      {/* ================= NOTES ================= */}

      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">
          Notes
        </label>

        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          rows="4"
          placeholder="Add interview notes, recruiter details, preparation notes..."
          className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
        />
      </div>

      {/* ================= BUTTONS ================= */}

      <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={onCancel}
          disabled={submitting}
          className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={submitting}
          className="rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? (
            <span className="flex items-center justify-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
              Saving...
            </span>
          ) : initialData ? (
            "Update Application"
          ) : (
            "Save Application"
          )}
        </button>
      </div>
    </form>
  );
};

export default JobForm;
