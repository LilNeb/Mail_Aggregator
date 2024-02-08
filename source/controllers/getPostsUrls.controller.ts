import { Request, Response, NextFunction } from "express";
import axios from "axios";
import fs from "fs";

export async function getPostsUrlsFromCategory(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const categoryName = req.params.categoryName; // Assuming the category name is passed as a request parameter
    console.log(categoryName); // Log the received category name

    // Read the categories and IDs from the local file
    const categoryData = fs.readFileSync(
      "local-data/categories-and-id.json",
      "utf8"
    );
    const categoryMap: { [name: string]: { id: string } } =
      JSON.parse(categoryData);

    const categoryId = categoryMap[categoryName].id; // Get the corresponding category ID from the map
    const id = categoryId ? categoryId : null; // Extract the value of id, or set it to null if categoryId is falsy
    console.log(categoryId); // Log the category ID

    if (!categoryId) {
      throw new Error("Invalid category name");
    }

    const url = `https://substack.com/api/v1/trending?limit=36&category_id=${categoryId}`;
    console.log(url); // Log the final URL

    const postsResult = await axios.get(url);

    const posts = postsResult.data.posts; // Get the "posts" table from the API response

    const formattedData = posts.reduce((acc: any, post: any) => {
      const { title, canonical_url } = post; // Extract the "title" and "canonical_url" values from each post
      acc[title] = { url: canonical_url }; // Create an object with the desired format
      return acc;
    }, {});

    return res.send(formattedData);
  } catch (error) {
    return next(error);
  }
}

export default getPostsUrlsFromCategory;
