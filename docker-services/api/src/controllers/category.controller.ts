import { Request, Response, NextFunction } from "express";
import axios from "axios";
import fs from "fs";
import logger from '../logger'; // Assurez-vous d'avoir un module logger configuré

export async function getCategories(req: Request, res: Response, next: NextFunction) {
    logger.info("Fetching categories from Substack API");
    try {
        const result = await axios.get("https://substack.com/api/v1/categories");
        const categories = result.data.reduce((acc: any, category: any) => {
            acc[category.slug] = { id: category.id };
            return acc;
        }, {});

        fs.writeFileSync(`${process.env.CONTAINER_CATEGORIES_FILE_PATH}`, JSON.stringify(categories));

        logger.info("Categories fetched and saved successfully.");
        return res.send(categories);
    } catch (error) {
        logger.error("Error fetching categories from Substack API", error);
        return next(error);
    }
}

export default getCategories;