import { useState } from "react";
import { askQuestion } from "../services/api";

function QuestionBox({ documentId, onAnswer }) {
    const [question, setQuestion] = useState("");
    const [asking, setAsking] = useState(false);
    const [message, setMessage] = useState("");

    const handleAsk = async () => {
        if (!question.trim()) {
            setMessage("Please enter a question.");
            return;
        }

        try {
            setAsking(true);
            setMessage("");

            const data = await askQuestion(
                question,
                documentId
            );

            onAnswer(data);

            setQuestion("");
        } catch (error) {
            setMessage(error.message);
        } finally {
            setAsking(false);
        }
    };

   return (
    <div className="question-box">
        <h2>Ask a question</h2>

        <div className="question-row">
            <input
                type="text"
                value={question}
                onChange={(event) =>
                    setQuestion(event.target.value)
                }
                placeholder="Ask something about your PDF..."
            />

            <button
                onClick={handleAsk}
                disabled={asking}
            >
                {asking ? "Thinking..." : "Ask"}
            </button>
        </div>

        {message && (
            <p className="question-message">
                {message}
            </p>
        )}
    </div>
);
}

export default QuestionBox;