import swaggerUi from "swagger-ui-express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const setupSwagger = (app) => {
  try {
    // Read the Swagger JSON file
    const swaggerPath = path.join(__dirname, "swager.json");
    const swaggerDocument = JSON.parse(fs.readFileSync(swaggerPath, "utf8"));
    
    // Update server URL with current port
    const port = process.env.PORT || 5000;
    swaggerDocument.servers = [
      {
        url: `http://localhost:${port}`,
        description: "Development server"
      }
    ];

    // Setup Swagger UI
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument, {
      explorer: true,
      customCss: '.swagger-ui .topbar { display: none }',
      customSiteTitle: "StayNow API Documentation"
    }));

    // Add a simple route to redirect to docs
    app.get("/api-docs", (req, res) => {
      res.redirect("/api-docs/");
    });

    console.log("✅ Swagger documentation configured successfully");
    // console.log(`📚 API Documentation available at: http://localhost:${port}/api-docs`);
    // console.log("📝 Documentation loaded from swager.json file");
    
  } catch (error) {
    console.error("❌ Error setting up Swagger:", error.message);
    console.log("📝 Make sure swager.json file exists and is valid JSON");
  }
};

export { setupSwagger };
