import express, { Application } from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./modules/auth/auth.route";
import installRouter from "./modules/install/install.route";
import { conditionalRawBody } from "./middleware/rawBody.middleware";
import superwallRouter from "./modules/superwall/superwall.route";
import appTrackerRoutes from "./modules/app-tracker/app-tracker.route";
import trackingLinkRoutes from "./modules/tracking-links/tracking-link.routes";
import clickRoutes from "./modules/clicks/click.routes";
dotenv.config();

const app: Application = express();

app.use(cors());
app.use(conditionalRawBody);

// Routes
app.get("/", (req, res) => {
  res.status(200).json({
    message: "API v2 is running",
    version: "1.0.7",
  });
});
app.use("/api/v2/auth", authRoutes);
app.use("/api/v2/webhooks/superwall", superwallRouter);
app.use("/api/v2/install", installRouter);
app.use("/api/v2/app-tracker", appTrackerRoutes);
app.use("/api/v2", trackingLinkRoutes);
app.use(clickRoutes); 

// Vercel
export default app;

// Local server
//const PORT = Number(process.env.PORT) || 5000;
//
//app.listen(PORT, "0.0.0.0", () => {
//  console.log(`Server running on port http://localhost:${process.env.PORT}`);
//});
