import { ChatGroq } from "@langchain/groq";

const llm = new ChatGroq({
    apiKey: process.env.GROQ_API_KEY,
    model: "openai/gpt-oss-20b",
    temperature: 0
});

export async function generateAnswer(question, chunks) {
    const context = chunks
        .map((chunk) => chunk.metadata.text)
        .join("\n\n");

    const prompt = `
You are a document question-answering assistant.

Answer the user's question using ONLY the provided document context.

If the answer cannot be found in the context, say:
"I could not find the answer in the document."

Document context:
${context}

User question:
${question}
`;

    const response = await llm.invoke(prompt);

    return response.content;
}