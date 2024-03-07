import {
  SCRAPPING_LIMIT,
  SUBSTACK_API_URL,
  SYNTHETIZER_API_URL,
} from "../constants";
import logger from "../logger"; // Assurez-vous d'avoir un module logger configuré
import fs from "fs";
import axios from "axios";

export const scrapPostsUrls = async (params: { categoryName: string }) => {
  const { categoryName } = params;

  logger.info(
    `[getPostsUrlsFromCategory] Reading category data from: ${process.env.CONTAINER_CATEGORIES_FILE_PATH}`
  );
  const categoryData = fs.readFileSync(
    `${process.env.CONTAINER_CATEGORIES_FILE_PATH}`,
    "utf8"
  );
  logger.info(`[getPostsUrlsFromCategory] Category data successfully read`);

  const categoryMap = JSON.parse(categoryData);
  const categoryId = categoryMap[categoryName]?.id;

  if (!categoryId) {
    logger.warn(
      `[getPostsUrlsFromCategory] Invalid category name: ${categoryName}`
    );
    throw new Error("Invalid category name");
  }

  // Log for fetching posts
  const url = `${SUBSTACK_API_URL}/trending?limit=${SCRAPPING_LIMIT}&category_id=${categoryId}`;
  logger.info(
    `[getPostsUrlsFromCategory] Fetching posts for categoryId: ${categoryId} from url: ${url}`
  );
  const postsResult = await axios.get(url);
  logger.info(`[getPostsUrlsFromCategory] Successfully fetched posts`);

  const posts = postsResult.data.posts;

  const formattedData = posts.reduce((acc: any, post: any) => {
    acc[post.title] = { url: post.canonical_url };
    return acc;
  }, {});

  // Log the formatted data being sent back
  logger.info(
    `[getPostsUrlsFromCategory] Post URLs fetched successfully for category: ${categoryName}`
  );
  logger.debug(
    `[getPostsUrlsFromCategory] Formatted data: ${JSON.stringify(
      formattedData,
      null,
      2
    )}`
  );

  return formattedData;
};

export const scrapPosts = async (params: { categoryName: string }) => {
  const { categoryName } = params;

  const formattedData = await scrapPostsUrls({ categoryName });

  const msUrl = process.env.MS1_URL;
  if (!msUrl) {
    throw new Error("MS1_URL is not defined");
  }
  const dataToSend = {
    category: categoryName,
    posts: formattedData,
  };

  // Log the data being sent to the microservice
  logger.info(
    `Sending data to microservice: ${JSON.stringify(dataToSend, null, 2)}`
  );

  await axios.post(msUrl, dataToSend);

  logger.info(
    `Posts of category: ${categoryName} posted successfully to microservice.`
  );
};

export const summarizePosts = async (params: { categoryName: string, limit:number }) => {
  const { categoryName, limit } = params;

  const summary = await axios.get(SYNTHETIZER_API_URL + "/summarize/" + categoryName + "/" + limit);

  return summary.data;
};
