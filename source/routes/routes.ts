import express from "express";
import { getCategories } from "../controllers/category.controller";
import { getPostsUrlsFromCategory } from "../controllers/getPostsUrls.controller";

const router = express.Router();

router.get("/getCategoriesAndId", getCategories);
router.get("/getPostsUrlsFromCategory/:categoryName", getPostsUrlsFromCategory);

export default router;
