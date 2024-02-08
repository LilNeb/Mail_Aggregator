import express from "express";
import { getCategories } from "../controllers/category.controller";

const router = express.Router();

router.get("/getCategories", getCategories);

router.get("");

export default router;
