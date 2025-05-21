import React, { useState } from 'react';

// Main app component
function App() {
    // State to store the selected image file
    const [file, setFile] = useState(null);

    // State to store the result returned from HugginFace API
    const [result, setResult] = useState('');

    // State to track if API call is loading
    const [loading, setLoading] = useState(false);

    // Handle image file selection
    const handleFileChange = (e) => {
        setFile(e.target.files[0]); // Store selected file
        setResult(''); // Clear previous result
    };

    const handleUpload = async () => {
        if (!file) return;

        setLoading(true);

        const formData = new FormData();
        // attach file to FormData
        formData.append("file", file); 

        try {
            const response = await fetch(
                "https://api-inference.huggingface.co/models/facebook/detr-resnet-50", // DETR object detection model

                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer YOUR_HF_API_KEY`,
                    },
                    body: formData,
                }
            );

            const data = await response.json();

            // If valid prediction data is returned 
            
            if (data && Array.isArray(data)) {
                const labels = data.map(obj => obj.label).join(', ');
                setResult(`Detected: ${labels}`);
            }
            // If error returned from API
            else if (data.error) {
                setResult(`Error: ${data.error}`);
            }
            // Catch-all fallback
            else {
                setResult("No object detected.");
            }
        } catch (error) {
            setResult("Failed to analyze image."); // In case of network/API error
        }
        setLoading(false); // Done loading

    };

    return (
        <div className = "min-h-screen bg-gray-100 p-8 flex flex-col items-center justify-center">
            <h1 className = "text-3xl font-bold mb-4"> LifeLens: Emergency Detector </h1>

            {/* File input for selecting an image */}
            <input
                type = "file"
                accept = "image/*"
                onChange = {handleFileChange}
                className = "mb-4"
            />

            {/* Upload button triggers handleUpload */}
            <button
                onClick = {handleUpload}
                className = "px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                disabled = {loading}
            >
                {loading ? 'Analyzing....' : 'Upload & Analyze'}
            </button>

            {/* Show result returned from model */}
            {result && (
                <p className = "mt-6 text-lg text-center bg-white p-4 rounded shadow">
                    {result}
                </p>
            )}
        </div>
    );
}

export default App;