import { FaissStore } from "langchain/vectorstores/faiss";
import { HuggingFaceTransformersEmbeddings } from "@langchain/community/embeddings/hf_transformers";
import fs from "fs";
import path from "path";

let vectorStore: FaissStore | null = null;
let initPromise: Promise<FaissStore> | null = null;

export const initVectorStore = async () => {
  // Return existing store if already initialized
  if (vectorStore) return vectorStore;

  // Prevent multiple simultaneous initializations
  if (initPromise) return initPromise;

  initPromise = (async () => {
    try {
      const filePath = path.join(__dirname, "../../data/inception.txt");

      // Check if file exists
      if (!fs.existsSync(filePath)) {
        throw new Error(`Data file not found at ${filePath}`);
      }

      const text = fs.readFileSync(filePath, "utf-8");

      if (!text || text.trim().length === 0) {
        throw new Error("Data file is empty");
      }

      const docs = text
        .split("\n")
        .filter((line) => line && line.trim().length > 0)
        .map((line) => ({
          pageContent: line.trim(),
          metadata: {},
        }));

      if (docs.length === 0) {
        throw new Error("No valid documents found in data file");
      }

      console.log(`📚 Loading ${docs.length} documents for vector store...`);

      const embeddings = new HuggingFaceTransformersEmbeddings({
        modelName: "Xenova/all-MiniLM-L6-v2",
      });

      vectorStore = await FaissStore.fromDocuments(docs, embeddings);

      console.log("✅ FAISS Vector DB Initialized successfully");

      return vectorStore;
    } catch (error) {
      console.error("❌ Vector Store Initialization Error:", error);
      throw error;
    }
  })();

  return initPromise;
};