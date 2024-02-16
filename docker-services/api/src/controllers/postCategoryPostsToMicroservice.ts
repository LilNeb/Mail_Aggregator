import { Request, Response, NextFunction } from "express";
import axios from "axios";
import fs from "fs";

export async function postCategoryPostsToMicroservice(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const categoryName = req.params.categoryName;
    const categoryPath = process.env.CONTAINER_CATEGORIES_FILE_PATH;
    if (!categoryPath) {
      throw new Error("Invalid category path");
    }
    console.log(categoryName);

    console.log(`Reading from: ${process.env.CONTAINER_CATEGORIES_FILE_PATH}`);
    const categoryData = fs.readFileSync(categoryPath, "utf8");

    const categoryMap: { [name: string]: { id: string } } =
      JSON.parse(categoryData);

    const categoryId = categoryMap[categoryName]?.id;
    console.log(categoryId);

    if (!categoryId) {
      throw new Error("Invalid category name");
    }

    const url = `https://substack.com/api/v1/trending?limit=50&category_id=${categoryId}`;
    console.log(url);

    const postsResult = await axios.get(url);
    const posts = postsResult.data.posts;

    const formattedData = posts.reduce((acc: any, post: any) => {
      const { title, canonical_url } = post;
      acc[title] = { url: canonical_url };
      return acc;
    }, {});

    // Envoyer les données au microservice
    const defaultURL = process.env.MS1_URL
      ? process.env.MS1_URL
      : "PROBLEM WITH MS1 URL"; // Remplacez par l'URL de votre microservice
    console.log(
      `Sending data to microservice: ${defaultURL} with data: ${JSON.stringify(
        formattedData
      )}`
    );
    await axios.post(defaultURL, formattedData);
    defaultURL;
    return res.send(formattedData);
  } catch (error) {
    console.error(error);
    return next(error);
  }
}
