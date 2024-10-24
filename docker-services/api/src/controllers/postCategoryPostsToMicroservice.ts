import { Request, Response, NextFunction } from "express";
import logger from '../logger'; // Assurez-vous d'avoir un module logger configuré
import { scrapPosts } from "../service/posts.service";

export async function sendPostsToScrapToMicroservice(req: Request, res: Response, next: NextFunction) {
    const categoryName = req.params.categoryName;
    logger.info(`Posting posts of category: ${categoryName} to microservice`);

    try {
        await scrapPosts({
            categoryName,
        });
        
        return res.send("success!");
    } catch (error) {
        logger.error(`Error posting posts of category: ${categoryName} to microservice`, error);
        return next(error);
    }
}

export default sendPostsToScrapToMicroservice;