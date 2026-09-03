import { useState } from "react";
import api from "../services/api";

const ResumeAnalyzer = () => {
  const [file, setFile] = useState(null);
  const [analysis, setAnalysis] = useState(null);

  const [uploading, setUploading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ================================
  // HANDLE FILE SELECT
  // ================================
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];

    setError("");
    setSuccess("");
    setAnalysis(null);

    if (!selectedFile) {
      setFile(null);
      return;
    }

    // Check PDF
    if (selectedFile.type !== "application/pdf") {
      setError("Only PDF files are allowed.");
      setFile(null);
      return;
    }

    // Check 5MB
    if (selectedFile.size > 5 * 1024 * 1024) {
      setError("Resume size must be less than 5 MB.");
      setFile(null);
      return;
    }

    setFile(selectedFile);
  };

  // ================================
  // UPLOAD RESUME
  // ================================
  const handleUpload = async () => {
    if (!file) {
      setError("Please select a PDF resume first.");
      return;
    }

    try {
      setUploading(true);
      setError("");
      setSuccess("");

      const formData = new FormData();

      formData.append("resume", file);

      const response = await api.post("/resume/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        setSuccess("Resume uploaded successfully.");
      } else {
        throw new Error(response.data.message || "Resume upload failed.");
      }
    } catch (err) {
      console.error("Resume Upload Error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to upload resume. Please try again.",
      );
    } finally {
      setUploading(false);
    }
  };

  // ================================
  // ANALYZE RESUME
  // ================================
  const handleAnalyze = async () => {
    try {
      setAnalyzing(true);
      setError("");
      setSuccess("");

      const response = await api.post("/resume/analyze");

      if (response.data.success) {
        setAnalysis(response.data.analysis);

        setSuccess("Resume analyzed successfully.");
      } else {
        throw new Error(response.data.message || "Resume analysis failed.");
      }
    } catch (err) {
      console.error("Resume Analysis Error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to analyze resume. Please upload a resume first.",
      );
    } finally {
      setAnalyzing(false);
    }
  };

  // ================================
  // SCORE COLOR
  // ================================
  const getScoreColor = (score) => {
    if (score >= 80) {
      return "text-green-600";
    }

    if (score >= 60) {
      return "text-yellow-600";
    }

    return "text-red-600";
  };

  const getScoreLabel = (score) => {
    if (score >= 80) {
      return "Excellent";
    }

    if (score >= 60) {
      return "Good";
    }

    return "Needs Improvement";
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* ================================
          NAVBAR
      ================================= */}
      <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div>
            <h1 className="text-xl font-bold text-slate-900">JobTrack</h1>

            <p className="text-xs text-slate-500">Resume Analyzer</p>
          </div>

          <a
            href="/dashboard"
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
          >
            ← Dashboard
          </a>
        </div>
      </nav>

      {/* ================================
          MAIN
      ================================= */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">
            AI Resume Analyzer
          </h2>

          <p className="mt-2 max-w-2xl text-slate-600">
            Upload your resume and get AI-powered feedback on your skills,
            strengths, missing skills, and areas for improvement.
          </p>
        </div>

        {/* ================================
            ALERTS
        ================================= */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <div className="flex items-start gap-3">
              <span className="text-lg">⚠️</span>

              <div>
                <p className="font-semibold">Something went wrong</p>

                <p className="mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {success && (
          <div className="mb-6 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            <div className="flex items-start gap-3">
              <span className="text-lg">✅</span>

              <div>
                <p className="font-semibold">Success</p>

                <p className="mt-1">{success}</p>
              </div>
            </div>
          </div>
        )}

        {/* ================================
            UPLOAD CARD
        ================================= */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-6">
            <h3 className="text-xl font-bold text-slate-900">
              Upload Your Resume
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Upload your latest resume in PDF format. Maximum file size is 5
              MB.
            </p>
          </div>

          {/* Upload Area */}
          <label
            htmlFor="resume-upload"
            className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center transition hover:border-indigo-400 hover:bg-indigo-50/40"
          >
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100 text-3xl">
              📄
            </div>

            <p className="text-base font-semibold text-slate-800">
              Click to select your resume
            </p>

            <p className="mt-1 text-sm text-slate-500">
              PDF only • Maximum 5 MB
            </p>

            <input
              id="resume-upload"
              type="file"
              accept=".pdf,application/pdf"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>

          {/* Selected File */}
          {file && (
            <div className="mt-5 flex flex-col gap-4 rounded-xl border border-indigo-100 bg-indigo-50 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-white text-xl shadow-sm">
                  📄
                </div>

                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-slate-900">
                    {file.name}
                  </p>

                  <p className="text-xs text-slate-500">
                    {(file.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
              </div>

              <button
                onClick={handleUpload}
                disabled={uploading}
                className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {uploading ? "Uploading..." : "Upload Resume"}
              </button>
            </div>
          )}

          {/* Analyze Button */}
          <div className="mt-6 flex justify-center">
            <button
              onClick={handleAnalyze}
              disabled={analyzing}
              className="w-full rounded-xl bg-slate-900 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto sm:min-w-64"
            >
              {analyzing
                ? "🤖 AI is analyzing..."
                : "🤖 Analyze Resume with AI"}
            </button>
          </div>
        </div>

        {/* ================================
            ANALYSIS RESULTS
        ================================= */}
        {analysis && (
          <div className="mt-8 space-y-6">
            {/* Results Header */}
            <div>
              <h3 className="text-2xl font-bold text-slate-900">
                Resume Analysis
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                AI-powered analysis of your resume.
              </p>
            </div>

            {/* ================================
                SCORE + SUMMARY
            ================================= */}
            <div className="grid gap-6 lg:grid-cols-3">
              {/* Score */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <p className="text-sm font-medium text-slate-500">
                  Resume Score
                </p>

                <div className="mt-5 flex items-center justify-center">
                  <div className="flex h-36 w-36 flex-col items-center justify-center rounded-full border-8 border-indigo-100">
                    <span
                      className={`text-4xl font-bold ${getScoreColor(
                        analysis.score,
                      )}`}
                    >
                      {analysis.score}
                    </span>

                    <span className="text-sm text-slate-500">/ 100</span>
                  </div>
                </div>

                <p
                  className={`mt-4 text-center text-lg font-semibold ${getScoreColor(
                    analysis.score,
                  )}`}
                >
                  {getScoreLabel(analysis.score)}
                </p>
              </div>

              {/* Summary */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
                <h4 className="text-lg font-bold text-slate-900">AI Summary</h4>

                <p className="mt-4 leading-7 text-slate-600">
                  {analysis.summary}
                </p>
              </div>
            </div>

            {/* ================================
                SKILLS
            ================================= */}
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Skills */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h4 className="text-lg font-bold text-slate-900">
                  💪 Skills Detected
                </h4>

                <div className="mt-5 flex flex-wrap gap-2">
                  {analysis.skills?.length > 0 ? (
                    analysis.skills.map((skill, index) => (
                      <span
                        key={`${skill}-${index}`}
                        className="rounded-full bg-green-50 px-3 py-1.5 text-sm font-medium text-green-700"
                      >
                        {skill}
                      </span>
                    ))
                  ) : (
                    <p className="text-sm text-slate-500">
                      No skills detected.
                    </p>
                  )}
                </div>
              </div>

              {/* Missing Skills */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h4 className="text-lg font-bold text-slate-900">
                  🎯 Missing / Recommended Skills
                </h4>

                <div className="mt-5 flex flex-wrap gap-2">
                  {analysis.missingSkills?.length > 0 ? (
                    analysis.missingSkills.map((skill, index) => (
                      <span
                        key={`${skill}-${index}`}
                        className="rounded-full bg-orange-50 px-3 py-1.5 text-sm font-medium text-orange-700"
                      >
                        {skill}
                      </span>
                    ))
                  ) : (
                    <p className="text-sm text-slate-500">
                      No missing skills identified.
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* ================================
                STRENGTHS + IMPROVEMENTS
            ================================= */}
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Strengths */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h4 className="text-lg font-bold text-slate-900">
                  ⭐ Strengths
                </h4>

                <div className="mt-5 space-y-3">
                  {analysis.strengths?.length > 0 ? (
                    analysis.strengths.map((strength, index) => (
                      <div
                        key={index}
                        className="flex gap-3 rounded-xl bg-green-50 p-4"
                      >
                        <span className="mt-0.5 text-green-600">✓</span>

                        <p className="text-sm leading-6 text-green-900">
                          {strength}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-slate-500">
                      No strengths available.
                    </p>
                  )}
                </div>
              </div>

              {/* Improvements */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h4 className="text-lg font-bold text-slate-900">
                  🚀 Improvements
                </h4>

                <div className="mt-5 space-y-3">
                  {analysis.improvements?.length > 0 ? (
                    analysis.improvements.map((improvement, index) => (
                      <div
                        key={index}
                        className="flex gap-3 rounded-xl bg-indigo-50 p-4"
                      >
                        <span className="mt-0.5 font-bold text-indigo-600">
                          {index + 1}.
                        </span>

                        <p className="text-sm leading-6 text-indigo-900">
                          {improvement}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-slate-500">
                      No improvements available.
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* ================================
                ACTION
            ================================= */}
            <div className="rounded-2xl border border-indigo-100 bg-indigo-50 p-6 text-center">
              <h4 className="text-lg font-bold text-indigo-900">
                Keep improving your resume 🚀
              </h4>

              <p className="mx-auto mt-2 max-w-2xl text-sm leading-6 text-indigo-700">
                Use the recommendations above to improve your resume and
                increase your chances of getting shortlisted.
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ResumeAnalyzer;
