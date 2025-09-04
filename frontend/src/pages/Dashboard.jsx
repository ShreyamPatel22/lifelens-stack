import { useEffect, useState } from "react";
import { api } from "../shared/api";

export default function Dashboard() {
    const [alerts, setAlerts] = useState([]);

    useEffect(() => {
        (async () => {
            try {
                const data = await api.get("/alerts");
                setAlerts(data);
            } catch {
                setAlerts([]);
            }
        })();
    }, []);

    return (
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <h1 className="text-2xl font-semibold">Recent Alerts</h1>
            <p className="text-gray-600">This will populate from the backend.</p>
            <div className="mt-4 divide-y">
                {alerts.length === 0 ? (
                    <p className="text-gray-500"> No alerts yet.</p>
                ) : alerts.map(a => (
                    <div key = {a.id} className="py-3 flex items-center justify-between">
                        <div>
                            <p className="font-medium">{a.name}</p>
                            <p className="text-sm text-gray-500">{a.created_at}</p>
                        </div>
                        <span className="rounded-full border px-3 py-1 text-sm">{a.severity}</span>
                    </div>
                ))}
            </div>
        </div>
    );

}