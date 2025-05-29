import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import recipesRoutes from "./routes/recipes";
import ingredientsRoutes from "./routes/ingredient";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);
app.use(bodyParser.json());

app.use(recipesRoutes);
app.use(ingredientsRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
