import { Request, Response, NextFunction } from "express";
import logger from '../logger'; // Assurez-vous d'avoir un module logger configuré
import { scrapPostsUrls } from "../service/posts.service";

export async function getPostsUrlsFromCategory(req: Request, res: Response, next: NextFunction) {
    const categoryName = req.params.categoryName;
    logger.info(`[getPostsUrlsFromCategory] Fetching post URLs for category: ${categoryName}`);

    try {
        const formattedData = await scrapPostsUrls({ categoryName });
        return res.send(formattedData);
    } catch (error) {
        logger.error(`[getPostsUrlsFromCategory] Error fetching post URLs for category: ${categoryName}`, error);
        return next(error);
    }
}

export default getPostsUrlsFromCategory;
