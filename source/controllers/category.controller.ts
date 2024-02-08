import { Request, Response, NextFunction } from "express";
import axios, { AxiosResponse } from "axios";

export async function getCategories(
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.log("testFunction");
  try {
    let result = await axios.get("https://substack.com/api/v1/categories");
    const categories = result.data.map((category: any) => {
      return {
        id: category.id,
        slug: category.slug,
      };
    });
    return res.send(categories);
  } catch (error) {
    return next(error);
  }
}

export default getCategories;
