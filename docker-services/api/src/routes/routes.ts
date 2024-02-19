import express from "express";
import { getCategories } from "../controllers/category.controller";
import { getPostsUrlsFromCategory } from "../controllers/getPostsUrls.controller";
import { postCategoryPostsToMicroservice } from "../controllers/postCategoryPostsToMicroservice";

const router = express.Router();

router.get("/categories", getCategories);
router.get("/posts/:categoryName", getPostsUrlsFromCategory);

router.post(
  "/markdown/:categoryName",
  postCategoryPostsToMicroservice
);

export default router;
