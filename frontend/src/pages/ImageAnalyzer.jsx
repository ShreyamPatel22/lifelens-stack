import { useState, useRef, useEffect } from "react";

export default function ImageAnalyzer() {
    // Backend base URL frorm .env
    const API = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState("");
    const [result, setResult] = useState(null);
    const [busy, setBusy] = useState(false);
    const imgRef = useRef(null);
    const [natural, setNatural] = useState({w:1, h:1 });

    // Make a preview URL whenever file changes
    useEffect(() => {
        if (!file) return setPreview("");
        const url = URL.createObjectURL(file);
        setPreview(url);
        return () => URL.revokeObjectURL(url);
    }, [file]);

    // Store natural image size when it loads
    const onImgLoad = () => {
        const el = imgRef.current;
        if (el) setNatural({ w: el.naturalWidth, h: el.naturalHeight });
    };

    const submit = async (e) => {
        e.preventDefault();
        if (!file) return;
        setBusy(true); setResult(null);
        const fd = new FormData();
        fd.append("file", file);

        try {
            const r = await fetch(`${API}/analyze-image`, {method: "POST", body: fd});
            const j = await r.json();
            setResult(j);
        } catch (err) {
            setResult({ error: String(err)});
        } finally {
            setBusy(false);
        }
    };

    // Convert model boxes to CSS pixels for rendered image
    const boxes = (() => {
        if (!Array.isArray(result) || imgRef.current) return [];
        const rw = imgRef.current.clientWidth;
        const rh = imgRef.current.clientHeight;
        const sx = rw / natural.w, sy = rh / natural.h;
        return result.map((d, i) => {
            const b = d.box || {};
            return {
                id: i, label: d.label, score: d.score,
                left: (b.xmin ?? 0) * sx,
                top: (b.ymin ?? 0) * sy,
                width: ((b.xmax ?? 0) - (b.xmin ?? 0)) * sx,
                height: ((b.ymax ?? 0) - (b.ymin ?? 0)) * sy,
            };
        });
    })();

    return (
        <div className="mx-auto max-w-5xl grid gap-6 md: grid-cols-2">
            <section className="rounded-2xl border bg-white p-6 shadow-sm">
                <h2 className="text-2xl font-semibold"> Image Analyzer</h2>
                <form onSubmit={submit} className="mt-4 grod gap-3">
                    <input type = "file" accept="image/*"
                        onChange={(e) => setFile(e.target.files?.[0] || null)}
                        className="rounded-xl border p-3"/>
                    <button disabled={!file||busy}
                        className="rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white disabled:opacity-50">
                        {busy ? "Analyzing..." : "Analyze"}
                    </button>
                </form>
                <pre className="mt-4 text-sm overflow-auto max-h-80 bg-gray-50 p-3 rounded-lg">
                    {result ? JSON.stringify(result, null, 2) : "Results will appear here…"}
                </pre>
            </section>

            <section className="rounded-2xl border bg-white p-6 shadow-sm">
                <h2 className="text-2xl font-semibold"> Preview </h2>
                {preview ? (
                    <div className="relative mt-4 inline-block">
                        <img ref={imgRef} src={preview} onLoad={onImgLoad}
                            className="max-w-full h-auto rounded-xl border" />
                        {boxes.map(b => (
                            <div key={b.id}
                                className="absolute border-2 rounded-md"
                                style={{left:b.left, top:b.top, width:b.width, height:b.height}}
                                title={`${b.label} ${(b.score*100).toFixed(1)}%`}>
                            <div className="absolute -top-6 left-0 text-xs bg-black/80 text-white px-2 py-0.5 rounded">
                                {b.label} {(b.score*100).toFixed(0)}%
                            </div>
                        </div>   
                        ))}
                    </div>
                ) : <p className="text-gray-500 mt-4">Upload an image to see detections.</p>}
            </section>
        </div>
    );
}