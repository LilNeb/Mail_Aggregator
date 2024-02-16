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
    console.log(categoryName);

    const categoryData = fs.readFileSync(
      "local-data/categories-and-id.json",
      "utf8"
    );
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
    const microserviceUrl = "http://localhost:3000/data"; // Remplacez par l'URL de votre microservice
    await axios.post(microserviceUrl, formattedData);

    return res.send(formattedData);
  } catch (error) {
    console.error(error);
    return next(error);
  }
}
