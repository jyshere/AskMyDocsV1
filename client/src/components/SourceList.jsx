function SourceList({ sources }) {
    if (!sources || sources.length === 0) {
        return null;
    }

    return (
        <div>
            <h2>Sources</h2>

            {sources.map((source, index) => (
                <div key={index}>
                    <p>
                        <strong>Source {index + 1}</strong>
                    </p>

                    <p>{source.text}</p>

                    <small>
                        Similarity: {source.score.toFixed(2)}
                    </small>
                </div>
            ))}
        </div>
    );
}

export default SourceList;