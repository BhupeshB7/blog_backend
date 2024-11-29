import express from "express";
import cors from "cors";
const app = express();
const port = 5000 || process.env.PORT;

app.use(cors({
  origin: "*",
}));
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

// Database connection
import connectDB from "./config/db.js";
connectDB();
import { clerkMiddleware } from "@clerk/express";
app.use(clerkMiddleware());
import mainRoute from "./routes/route.js";
import webhookRoute from "./routes/webhook.route.js";
app.use("/webhook", webhookRoute);
// middleware
app.use(express.json());
// route file
app.get("/", (req, res) => {
  res.send("Hello World!");
});
 
app.use("/api", mainRoute);
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
