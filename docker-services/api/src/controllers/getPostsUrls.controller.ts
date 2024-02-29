import { Request, Response, NextFunction } from "express";
import axios from "axios";
import fs from "fs";
import logger from '../logger'; // Assurez-vous d'avoir un module logger configuré

export async function getPostsUrlsFromCategory(req: Request, res: Response, next: NextFunction) {
    const categoryName = req.params.categoryName;
    logger.info(`[getPostsUrlsFromCategory] Fetching post URLs for category: ${categoryName}`);

    try {
        // Log for reading category data
        logger.info(`[getPostsUrlsFromCategory] Reading category data from: ${process.env.CONTAINER_CATEGORIES_FILE_PATH}`);
        const categoryData = fs.readFileSync(`${process.env.CONTAINER_CATEGORIES_FILE_PATH}`, "utf8");
        logger.info(`[getPostsUrlsFromCategory] Category data successfully read`);

        const categoryMap = JSON.parse(categoryData);
        const categoryId = categoryMap[categoryName]?.id;

        if (!categoryId) {
            logger.warn(`[getPostsUrlsFromCategory] Invalid category name: ${categoryName}`);
            throw new Error("Invalid category name");
        }

        // Log for fetching posts
        const url = `https://substack.com/api/v1/trending?limit=50&category_id=${categoryId}`;
        logger.info(`[getPostsUrlsFromCategory] Fetching posts for categoryId: ${categoryId} from url: ${url}`);
        const postsResult = await axios.get(url);
        logger.info(`[getPostsUrlsFromCategory] Successfully fetched posts`);

        const posts = postsResult.data.posts;

        const formattedData = posts.reduce((acc: any, post: any) => {
            acc[post.title] = { url: post.canonical_url };
            return acc;
        }, {});

        // Log the formatted data being sent back
        logger.info(`[getPostsUrlsFromCategory] Post URLs fetched successfully for category: ${categoryName}`);
        logger.debug(`[getPostsUrlsFromCategory] Formatted data: ${JSON.stringify(formattedData, null, 2)}`);

        return res.send(formattedData);
    } catch (error) {
        logger.error(`[getPostsUrlsFromCategory] Error fetching post URLs for category: ${categoryName}`, error);
        return next(error);
    }
}

export default getPostsUrlsFromCategory;
