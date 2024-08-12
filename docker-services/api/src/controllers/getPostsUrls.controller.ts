import { Request, Response, NextFunction } from "express";
import axios from "axios";
import fs from "fs";
import logger from '../logger'; // Assurez-vous d'avoir un module logger configuré

export async function getPostsUrlsFromCategory(req: Request, res: Response, next: NextFunction) {
    const categoryName = req.params.categoryName;
    logger.info(`Fetching post URLs for category: ${categoryName}`);

    try {
        const categoryData = fs.readFileSync(`${process.env.CONTAINER_CATEGORIES_FILE_PATH}`, "utf8");
        const categoryMap = JSON.parse(categoryData);
        const categoryId = categoryMap[categoryName]?.id;

        if (!categoryId) {
            logger.warn(`Invalid category name: ${categoryName}`);
            throw new Error("Invalid category name");
        }

        const url = `https://substack.com/api/v1/trending?limit=50&category_id=${categoryId}`;
        const postsResult = await axios.get(url);
        const posts = postsResult.data.posts;

        const formattedData = posts.reduce((acc: any, post: any) => {
            acc[post.title] = { url: post.canonical_url };
            return acc;
        }, {});

        logger.info(`Post URLs fetched successfully for category: ${categoryName}`);
        return res.send(formattedData);
    } catch (error) {
        logger.error(`Error fetching post URLs for category: ${categoryName}`, error);
        return next(error);
    }
}

export default getPostsUrlsFromCategory;
