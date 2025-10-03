import {useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AlertForm from "../shared/AlertForm";

// Helper to read API base URLno 
const API = import.meta.env.VITE_API_URL?.replace(/\/$/, "");

export default function Home() {
    const [apiStatus, setApiStatus] = useState("idle");
    const [apiMessage, setApiMessage] = useState("");

    useEffect(() => {
        if (!API) {
            setApiStatus("down");
            setApiMessage("VITE_API_URL not set");
            return;
        }
    
        setApiStatus("checking");

        // No cache so pill reflects reality each visit
        fetch(`${API}/healthz`, { cache: "no-store"}).then(async (r) => {
            if (!r.ok) throw new Error (`HTTP ${r.status}`);
            const data = await r.json().catch(() => ({}));
            setApiStatus("ok");
            setApiMessage(data?.version ? `OK (v${data.version})` : "OK");
        })
        .catch((e) => {
            setApiStatus("down");
            setApiMessage(e.message || "unreachable");
        });
    }, [])

    // Small rendere for the API status chip
    const ApiPill = () => {
        if (apiStatus === "checking") return <span className="text-gray-500"> Checking...</span>;
        if (apiStatus === "ok") return <span className="text-green-700 font-semibold"> {apiMessage} </span>;
        if (apiStatus === "down") return <span className = "text-red-700 font-semitbold"> {apiMessage} </span>
        return <span className="text-gray-500"> Not checked</span>
    }

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
                    <li className="rounded-lg border p-3"> API connectivity test: <ApiPill /> </li>
                    <li className="rounded-lg border p-3"> Location services: Ready </li>
                </ul>
            </section>
        </div>
    )
}