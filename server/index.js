import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import fs from "node:fs/promises";
import crypto from "node:crypto";

import { processPdf } from "./services/pdfService.js";
import {
    storeChunks,
    searchChunks
} from "./services/vectorService.js";
import { generateAnswer } from "./services/llmService.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const upload = multer({
    dest: "uploads/"
});


app.get("/", (req, res) => {
    res.json({
        message: "AskMyDocs backend is running"
    });
});


app.post(
    "/api/documents/upload",
    upload.single("file"),
    async (req, res) => {

        try {

            if (!req.file) {
                return res.status(400).json({
                    message: "No PDF file uploaded"
                });
            }

            console.log("PDF received:", req.file.originalname);

            const documentId = crypto.randomUUID();

            const result = await processPdf(req.file.path);

            console.log("Pages:", result.totalPages);
            console.log("Chunks:", result.chunks.length);
            console.log("Document ID:", documentId);

            const storedCount = await storeChunks(
                result.chunks,
                documentId
            );
            await fs.unlink(req.file.path);

            res.json({
                message: "PDF processed successfully",
                documentId: documentId,
                filename: req.file.originalname,
                pages: result.totalPages,
                chunks: storedCount
            });

        } catch (error) {

            console.error(error);

            res.status(500).json({
                message: "Failed to process PDF",
                error: error.message
            });
        }
    }
);


app.post(
    "/api/ask",
    async (req, res) => {

        try {

            const { question, documentId } = req.body;

            if (!question || !documentId) {
                return res.status(400).json({
                    message: "Question and documentId are required"
                });
            }

            const chunks = await searchChunks(
    question,
    documentId
);

            if (chunks.length === 0) {
                return res.json({
                    answer: "I could not find relevant information in the document."
                });
            }

            const answer = await generateAnswer(
                question,
                chunks
            );

            res.json({
                answer,
                sources: chunks.map(
                    (chunk) => ({
                        text: chunk.metadata.text,
                        score: chunk.score
                    })
                )
            });

        } catch (error) {

            console.error(error);

            res.status(500).json({
                message: "Failed to answer question",
                error: error.message
            });
        }
    }
);


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(
        `Server running on port ${PORT}`
    );
});