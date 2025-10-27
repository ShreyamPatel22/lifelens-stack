import { Link } from "react-router-dom";

// optional: available if you want to show it somewhere later
const API = import.meta.env.VITE_API_URL?.replace(/\/$/, "");

export default function Landing() {
  return (
    <main className="space-y-12">
      {/* Hero */}
      <section className="rounded-2xl border bg-gradient-to-br from-blue-50 to-white p-8 md:p-14">
        <div className="mx-auto max-w-6xl grid md:grid-cols-2 gap-10 items-center">
          {/* Left column: copy & CTAs */}
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight text-gray-900">
              LifeLens <span className="text-blue-700">helps you see risks</span> — and act faster.
            </h1>
            <p className="mt-4 text-gray-600 text-lg">
              Upload an image, get instant hazard insights, and share clear next steps with responders.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to="/analyze"
                className="px-5 py-3 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700"
              >
                Try Image Analyzer
              </Link>

              <Link
                to="/report"
                className="px-5 py-3 rounded-lg border font-medium hover:bg-gray-50"
              >
                Send an Emergency Report
              </Link>

              <a
                href="https://lifelens-backend.onrender.com/docs"
                target="_blank"
                rel="noreferrer"
                className="px-5 py-3 rounded-lg border font-medium hover:bg-gray-50"
              >
                API Docs
              </a>
            </div>

            <p className="mt-3 text-xs text-gray-500">
              Privacy-aware: images are only sent to the backend when you click Analyze.
            </p>
          </div>

          {/* Right column: visual */}
          {/* TODO: Replace with a real screenshot */}
          <div className="rounded-2xl border bg-white shadow-sm p-4">
            <div className="aspect-video w-full rounded-lg bg-gray-100 grid place-items-center text-gray-400">
              App preview
            </div>
          </div>
        </div>
      </section>

      {/* Feature Cards */}
      <section className="mx-auto max-w-6xl px-4 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { title: "Fast hazard detection", desc: "Run analysis in seconds with confidence scores." },
          { title: "Actionable guidance", desc: "Clear next steps tailored for the situation." },
          { title: "Built for responders", desc: "Simple reporting workflow and live status at a glance." },
        ].map((f, i) => (
          <article
            key={i}
            className="rounded-xl border bg-white p-6 shadow-sm hover:shadow-md transition"
          >
            <h3 className="font-semibold text-gray-900">{f.title}</h3>
            <p className="mt-2 text-gray-600 text-sm">{f.desc}</p>
          </article>
        ))}
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-6xl px-4">
        <div className="rounded-2xl border bg-white p-6 md:p-8">
          <h2 className="text-2xl font-bold">How it works</h2>
          <ol className="mt-4 grid gap-4 sm:grid-cols-3">
            {[
              { n: 1, t: "Capture or upload an image" },
              { n: 2, t: "Analyze to detect hazards" },
              { n: 3, t: "Share an alert with actions" },
            ].map((s) => (
              <li key={s.n} className="rounded-lg border p-4">
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white grid place-items-center font-bold">
                  {s.n}
                </div>
                <p className="mt-2 text-gray-700">{s.t}</p>
              </li>
            ))}
          </ol>

          <div className="mt-6">
            <Link
              to="/dashboard"
              className="px-5 py-3 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700"
            >
              Open Dashboard
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
