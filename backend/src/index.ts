import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import recipesRoutes from "./routes/recipes";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use("/api/recipes", recipesRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
