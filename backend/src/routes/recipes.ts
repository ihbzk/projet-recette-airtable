import { Router } from "express";
import Airtable from "airtable";
import dotenv from "dotenv";

dotenv.config();

const router = Router();

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
  process.env.AIRTABLE_BASE_ID as string
);

const tableName = "Recipes";

router.get("/", async (req, res) => {
  try {
    const records = await base(tableName)
      .select({ view: "Grid view" }) 
      .all();

    const recipes = records.map((record) => ({
      id: record.id,
      ...record.fields,
    }));

    res.json(recipes);
  } catch (error) {
    console.error("Error fetching data from Airtable:", error);
    res.status(500).json({ error: "Failed to fetch recipes from Airtable" });
  }
});

export default router;
