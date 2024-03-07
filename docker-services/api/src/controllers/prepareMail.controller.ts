import { Request, Response, NextFunction } from "express";
import { scrapPosts, summarizePosts } from "../service/posts.service";
import { SCRAPPING_LIMIT } from "../constants";

export const generateMail = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const categoryName = req.params.categoryName;

    await scrapPosts({
      categoryName,
    });

    const summary = await summarizePosts({
      categoryName,
      limit: SCRAPPING_LIMIT
    });
    res.send(summary);
  } catch (error) {
    console.error({ errorGeneratingMail: error });
    res.status(500).send("Error sending notification");
  }
};
