// simple fetch wrapper
// ex: local: VITE_API_URL: "http://127.0.0.1:8000"

const BASE = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

async function handle(res) {
    if (!res.ok) throw new Error(await res.text());
    return res.status === 204 ? null : res.json();
}

export const api = {
    async get(path) {
        const r = await fetch(`${BASE}${path}`);
        return handle(r);
    },
    async post(path, body) {
        const r = await fetch (`${BASE}${path}`, {
            method: "POST",
            headers: {"Content-Type" : "application/json"},
            body: JSON.stringify(body),
        });
        return handle(r);
    },
}
