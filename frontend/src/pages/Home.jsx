import AlertForm from "../shared/AlertForm";

export default function Home() {
    return (
        <div className="grid gap-6 md:grid-cols-2">
            <section className="rounded-2xl border bg-white p-6 shadow-sm">
                <h1 className="text-3xl font-semibold"> Emergency Report </h1>
                <p className="text-gray-600 mt-1"> Send an alert so responders get the info fast.</p>
                <div className="mt-6">
                    <AlertForm />
                </div>
            </section>

            <section className="rounded-2xl border bg-white p-6 shadow-sm">
                <h2 className="text-2xl font-semibold"> Live Status </h2>
                <ul className="mt-4 space-y-3">
                    <li className="rounded-lg border p-3"> System Status: <b> Online </b></li>
                    <li className="rounded-lg border p-3"> API connectivity test: <span id="api-status"> Not checked </span></li>
                    <li className="rounded-lg border p-3"> Location services: Ready </li>
                </ul>
            </section>
        </div>
    )
}