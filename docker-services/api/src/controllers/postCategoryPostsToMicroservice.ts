import { Request, Response, NextFunction } from "express";
import axios from "axios";
import fs from "fs";
import logger from '../logger'; // Assurez-vous d'avoir un module logger configuré

export async function postCategoryPostsToMicroservice(req: Request, res: Response, next: NextFunction) {
    const categoryName = req.params.categoryName;
    logger.info(`Posting posts of category: ${categoryName} to microservice`);

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

        const msUrl = process.env.MS1_URL;
        if (!msUrl) {
            throw new Error("MS1_URL is not defined");
        }
        const dataToSend = {
            category: categoryName,
            posts: formattedData
        };

        // Log the data being sent to the microservice
        logger.info(`Sending data to microservice: ${JSON.stringify(dataToSend, null, 2)}`);

        await axios.post(msUrl, dataToSend);        

        logger.info(`Posts of category: ${categoryName} posted successfully to microservice.`);
        return res.send(dataToSend);
    } catch (error) {
        logger.error(`Error posting posts of category: ${categoryName} to microservice`, error);
        return next(error);
    }
}

export default postCategoryPostsToMicroservice;
