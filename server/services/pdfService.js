import fs from "node:fs/promises";
import { getDocumentProxy, extractText } from "unpdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

export async function processPdf(filePath) {
    const buffer = await fs.readFile(filePath);

    const pdf = await getDocumentProxy(
        new Uint8Array(buffer)
    );

    const { text, totalPages } = await extractText(pdf, {
        mergePages: true
    });

    const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000,
        chunkOverlap: 200
    });

    const chunks = await splitter.splitText(text);

    return {
        text,
        chunks,
        totalPages
    };
}