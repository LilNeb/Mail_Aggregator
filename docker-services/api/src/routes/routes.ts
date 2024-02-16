import express from "express";
import { getCategories } from "../controllers/category.controller";
import { getPostsUrlsFromCategory } from "../controllers/getPostsUrls.controller";
import { postCategoryPostsToMicroservice } from "../controllers/postCategoryPostsToMicroservice";

const router = express.Router();

router.get("/getCategoriesAndId", getCategories);
router.get("/getPostsUrlsFromCategory/:categoryName", getPostsUrlsFromCategory);

router.post(
  "/postUrlsToMicroservice/:categoryName",
  postCategoryPostsToMicroservice
);

export default router;
