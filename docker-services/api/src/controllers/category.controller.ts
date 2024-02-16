import { Request, Response, NextFunction } from "express";
import axios from "axios";
import fs from "fs";

export async function getCategories(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    let result = await axios.get("https://substack.com/api/v1/categories");
    const categories = result.data.reduce((acc: any, category: any) => {
      acc[category.slug] = { id: category.id };
      return acc;
    }, {});

    fs.writeFileSync(
      `${process.env.CONTAINER_CATEGORIES_FILE_PATH}`,
      JSON.stringify(categories)
    );

    return res.send(categories);
  } catch (error) {
    return next(error);
  }
}

export default getCategories;
