import { useState } from "react";
import UploadBox from "./components/UploadBox.jsx";
import QuestionBox from "./components/QuestionBox.jsx";
import AnswerBox from "./components/AnswerBox.jsx";

function App() {
    const [document, setDocument] = useState(null);
    const [answer, setAnswer] = useState(null);

    const handleUploadSuccess = (data) => {
        setDocument(data);
        setAnswer(null);
    };

    const handleAnswer = (data) => {
        setAnswer(data);
    };

    return (
        <div className="app">
            <header className="header">
                <h1>AskMyDocs</h1>
                <p>Ask questions about your documents using AI.</p>
            </header>

            <main className="container">
                <section className="card">
                    <UploadBox
                        onUploadSuccess={handleUploadSuccess}
                    />
                </section>

                {document && (
                    <>
                        <section className="card">
                            <div className="document-info">
                                <div>
                                    <strong>📄 {document.filename}</strong>

                                    <p>
                                        {document.pages} page
                                        {document.pages !== 1 ? "s" : ""} ·{" "}
                                        {document.chunks} chunks
                                    </p>
                                </div>

                                <span className="success">
                                    ✓ Ready
                                </span>
                            </div>

                            <QuestionBox
                                documentId={document.documentId}
                                onAnswer={handleAnswer}
                            />
                        </section>

                        <section className="card">
                            <AnswerBox
                                answer={answer?.answer}
                            />
                        </section>
                    </>
                )}
            </main>
        </div>
    );
}

export default App;