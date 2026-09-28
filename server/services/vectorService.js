import dotenv from "dotenv";
import { Pinecone } from "@pinecone-database/pinecone";

dotenv.config();

const pinecone = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY
});

const index = pinecone.index({
    name: process.env.PINECONE_INDEX
});

const EMBEDDING_MODEL = "llama-text-embed-v2";

export async function storeChunks(chunks, documentId) {
    const embeddings = await pinecone.inference.embed({
        model: EMBEDDING_MODEL,
        inputs: chunks,
        parameters: {
            inputType: "passage",
            truncate: "END"
        }
    });

    const vectors = embeddings.data.map((embedding, i) => ({
        id: `chunk-${documentId}-${i}`,

        values: embedding.values,

        metadata: {
            text: chunks[i],
            documentId: documentId
        }
    }));

    await index.upsert({
        records: vectors
    });

    return vectors.length;
}


export async function searchChunks(question, documentId) {

    const embeddings = await pinecone.inference.embed({
        model: EMBEDDING_MODEL,
        inputs: [question],
        parameters: {
            inputType: "query",
            truncate: "END"
        }
    });

    const queryVector = embeddings.data[0].values;

    const result = await index.query({
        vector: queryVector,

        topK: 5,

        includeMetadata: true,

        filter: {
            documentId: {
                $eq: documentId
            }
        }
    });

    return result.matches || [];
}