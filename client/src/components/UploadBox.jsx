import { useState } from "react";
import { uploadDocument } from "../services/api";

function UploadBox({ onUploadSuccess }) {
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState("");

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];

        if (selectedFile) {
            setFile(selectedFile);
            setMessage("");
        }
    };

    const handleUpload = async () => {
    console.log("Upload button clicked");

    if (!file) {
        setMessage("Please select a PDF first.");
        return;
    }

    try {
        setUploading(true);
        setMessage("");

        // console.log("Sending PDF to backend...");

        const data = await uploadDocument(file);

        // console.log("Upload response:", data);

        setMessage(
            `Uploaded successfully. ${data.chunks} chunks created.`
        );

        onUploadSuccess(data);
    } catch (error) {
    console.error("Upload error:", error);
    setMessage("Something went wrong while uploading the PDF. Please try again.");
} finally {
        setUploading(false);
    }
};

   return (
    <div className="upload-box">
        <h2>Upload your PDF</h2>

        <div className="upload-row">
            <input
                id="pdf-input"
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
            />

            <label htmlFor="pdf-input" className="file-label">
                Choose PDF
            </label>

            {file && (
                <span className="file-name">
                    {file.name}
                </span>
            )}

            <button
                onClick={handleUpload}
                disabled={uploading}
            >
                {uploading ? "Uploading..." : "Upload PDF"}
            </button>
        </div>

        {message && (
            <p className="upload-message">
                {message}
            </p>
        )}
    </div>
);
}

export default UploadBox;