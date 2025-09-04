import { useState } from "react";
import { api } from "./api";

export default function AlertForm() {
    const [form, setForm] = useState({
        name: "",
        location: "",
        description: "",
        severity: "Medium",
    });
    const [submitting, setSubmitting] = useState(false);
    const [msg, setMsg] = useState("");

    const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
 
    const onSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setMsg("");
        try {
            await api.post("/alerts", form);
            setMsg("Alert sent successfully.");
            setForm({name: "", location: "", description: "", severity: "Medium"});
            const lbl = document.getElementById("api-status");
            if (lbl) lbl.textContent = "OK";
        } catch (err) {
            setMsg("Could not reach backend (run FASTAPI or set API_URL).");
            const lbl = document.getElementById("api-status");
            if (lbl) lbl.textContent = "Failed";
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <form onSubmit={onSubmit} className="grid gap-4">
            <input
                className="rounded-xl border p-3"
                placeholder="Your name"
                name="name"
                value={form.name}
                onChange={onChange}
                required
            />
            <input
                className="rounded-xl border p-3"
                placeholder="Location (address or GPS)"
                name="location"
                value={form.location}
                onChange={onChange}
                required
            />
            <textarea
                className="rounded-xl border p-3"
                rows="4"
                placeholder="Describe the emergency…"
                name="description"
                value={form.description}
                onChange={onChange}
                required
            />
            <select
                className="rounded-xl border p-3"
                name="severity"
                value={form.severity}
                onChange={onChange}
            >
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
                <option>Critical</option>
            </select>
            <button
                type="submit"
                disabled={submitting}
                className="rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
            >
                {submitting ? "Sending..." : "Send Alert"}
            </button>
            {msg && <p className="text-sm text-gray-700">{msg}</p>}
        </form>
    );
}