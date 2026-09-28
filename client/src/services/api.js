const API_URL = import.meta.env.VITE_API_URL;

export async function uploadDocument(file) {
    const formData = new FormData();

    formData.append("file", file);

    const response = await fetch(
        `${API_URL}/documents/upload`,
        {
            method: "POST",
            body: formData
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Upload failed");
    }

    return data;
}

export async function askQuestion(question, documentId) {
    const response = await fetch(
        `${API_URL}/ask`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                question,
                documentId
            })
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Failed to get answer");
    }

    return data;
}