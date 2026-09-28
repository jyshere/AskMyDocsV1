import ReactMarkdown from "react-markdown";

function AnswerBox({ answer }) {
    if (!answer) {
        return null;
    }

    return (
        <div className="answer-box">
            <h2>Answer</h2>

            <div className="answer-content">
                <ReactMarkdown>
                    {answer}
                </ReactMarkdown>
            </div>
        </div>
    );
}

export default AnswerBox;