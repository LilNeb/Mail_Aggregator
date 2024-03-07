import express from "express";
import { getCategories } from "../controllers/category.controller";
import { getPostsUrlsFromCategory } from "../controllers/getPostsUrls.controller";
import { sendPostsToScrapToMicroservice } from "../controllers/postCategoryPostsToMicroservice";
import { generateMail } from "../controllers/prepareMail.controller";

const router = express.Router();

router.get("/categories", getCategories);
router.get("/posts/:categoryName", getPostsUrlsFromCategory);
router.get("/generate-mail/:categoryName", generateMail);
router.post(
  "/markdown/:categoryName",
  sendPostsToScrapToMicroservice
);

export default router;
