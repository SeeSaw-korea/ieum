import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from 'dotenv';
import { ContentModel, TypeTestModel } from "./lib/models.js";
import { Category } from "./types.js";

// Load environment variables
dotenv.config({ path: '.env.local' });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  // Enable JSON parsing
  app.use(express.json());

  // Specific route for /fillout to serve fillout.html
  app.get("/fillout", (req, res) => {
    res.sendFile(path.join(process.cwd(), "fillout.html"));
  });

  // API routes MUST come before Vite middleware
  app.get("/api/regions", async (req, res) => {
    console.log("API call: /api/regions");
    try {
      const regions = await ContentModel.getRegions();
      res.json(regions);
    } catch (error) {
      console.error("Error fetching regions:", error);
      res.status(500).json({ error: "Failed to fetch regions" });
    }
  });

  app.get("/api/mbti-types", async (req, res) => {
    console.log("API call: /api/mbti-types");
    try {
      const mbtiTypes = await ContentModel.getMbtiTypes();
      res.json(mbtiTypes);
    } catch (error) {
      console.error("Error fetching MBTI types:", error);
      res.status(500).json({ error: "Failed to fetch MBTI types" });
    }
  });

  app.get("/api/contents", async (req, res) => {
    console.log("API call: /api/contents");
    try {
      const { category } = req.query;
      
      if (category) {
        const contents = await ContentModel.getContentsByCategory(category as Category);
        res.json(contents);
      } else {
        const contents = await ContentModel.getAllContents();
        res.json(contents);
      }
    } catch (error) {
      console.error("Error fetching contents:", error);
      res.status(500).json({ error: "Failed to fetch contents" });
    }
  });

  app.get("/api/contents/:id", async (req, res) => {
    console.log("API call: /api/contents/:id", req.params.id);
    try {
      const { id } = req.params;
      const content = await ContentModel.getContentById(id);
      
      if (!content) {
        res.status(404).json({ error: "Content not found" });
        return;
      }
      
      res.json(content);
    } catch (error) {
      console.error("Error fetching content:", error);
      res.status(500).json({ error: "Failed to fetch content" });
    }
  });


  app.post("/api/type-test", async (req, res) => {
    console.log("API call: POST /api/type-test");
    try {
      const { name, phone, region, status, worry, result } = req.body;
      if (!name || !phone || !region) {
        res.status(400).json({ error: "Required fields missing" });
        return;
      }
      await TypeTestModel.saveSubmission({ name, phone, region, status, worry, result });
      res.json({ success: true });
    } catch (error) {
      console.error("Error saving type test submission:", error);
      res.status(500).json({ error: "Failed to save submission" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    
    // In production, we still want /fillout to work if it's not in dist
    // But usually, it should be copied to dist during build if configured.
    // For now, we'll just handle it here.
    app.get("/fillout", (req, res) => {
      res.sendFile(path.join(process.cwd(), "fillout.html"));
    });

    app.get("/{*splat}", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
