// backend/data/food.js
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const foodsPath = path.join(__dirname, "./foods.json");

// Loaded once at startup instead of on every call. Previously this did a
// synchronous disk read + JSON.parse on every single AI plan-generation
// request, which is needless blocking I/O for a file that never changes
// while the server is running.
const foods = JSON.parse(fs.readFileSync(foodsPath, "utf-8"));

export function getAllFoods() {
  return foods;
}
