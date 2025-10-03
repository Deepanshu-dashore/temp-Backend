import express from "express";
import cors from "cors";

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use(cors({
  origin: process.env.CORS,
  credentials: true
}));

app.use(express.static("public"))
app.use("/uploads", express.static("public/uploads"));




// Import Routes 

import userRoutes from "./src/routes/user.routes.js";
app.use("/users", userRoutes);

import hotelRoutes from "./src/routes/hotel.routes.js";
app.use("/hotel", hotelRoutes);

import roomTypeRoutes from "./src/routes/roomType.routes.js";
app.use("/roomType", roomTypeRoutes);

import hotelTypeRoutes from "./src/routes/hotelType.routes.js";
app.use("/hotelType", hotelTypeRoutes);

import lmsRoutes from "./src/routes/lms.routes.js";
app.use("/lms", lmsRoutes);




// Health check route with Attractive HTML for StayNow
app.get("/health", (req, res) => {
  res.status(200).send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>StayNow | Server Health</title>
        <style>
            body {
                margin: 0;
                padding: 0;
                font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
                background: linear-gradient(135deg, #1e3c72, #2a5298);
                color: #fff;
                height: 100vh;
                display: flex;
                justify-content: center;
                align-items: center;
            }
            .card {
                background: rgba(255, 255, 255, 0.1);
                padding: 40px;
                border-radius: 15px;
                text-align: center;
                box-shadow: 0 8px 20px rgba(0,0,0,0.2);
                backdrop-filter: blur(10px);
                width: 90%;
                max-width: 500px;
                animation: fadeIn 1s ease-in-out;
            }
            h1 {
                font-size: 28px;
                margin-bottom: 10px;
                color: #00ffb3;
            }
            h2 {
                font-size: 22px;
                margin-bottom: 20px;
                color: #ffd166;
            }
            p {
                font-size: 16px;
                margin: 5px 0;
            }
            .status {
                margin: 20px 0;
                font-size: 18px;
                font-weight: bold;
                color: #06d6a0;
            }
            .timestamp {
                font-size: 14px;
                color: #ccc;
            }
            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(20px); }
                to { opacity: 1; transform: translateY(0); }
            }
        </style>
    </head>
    <body>
        <div class="card">
            <h1>✅ StayNow Server</h1>
            <h2>Health Check</h2>
            <p class="status">Server is Running Smoothly 🚀</p>
            <p class="timestamp">⏰ ${new Date().toLocaleString()}</p>
        </div>
    </body>
    </html>
  `);
});


export default app;