import axios from "axios";
import { summarizePosts } from "./posts.service";
import { SCRAPPING_LIMIT } from "../constants";

export type UserConfig = {
  telegramUrl: string;
  category: string;
};

export const allUserConfigs: UserConfig[] = [];

export const sendNotification = async (params: {
  summary: any[];
  telegramUrl: string;
}) => {
  const { summary, telegramUrl } = params;
  const message = JSON.stringify(summary, null, 2);
  await axios.get(
    telegramUrl + "&text=" + message
  );
};

export const saveNewUserConfig = async (params: {
  category: string;
  telegramUrl: string;
}) => {
  const { telegramUrl, category } = params;
  allUserConfigs.push({
    telegramUrl,
    category,
  });
  sendNotification({
    summary: [{ message: "You have subscribed to " + category }],
    telegramUrl,
  });
};

export const launchCron = async () => {
  setInterval(async () => {
    let summaryByCategory = new Map<string, any[]>();
    allUserConfigs.forEach(async (config) => {
      const { telegramUrl, category } = config;
      let summary;

      if (summaryByCategory.has(category)) {
        summary = summaryByCategory.get(category);
      } else {
        summary = await summarizePosts({
          categoryName: category,
          limit: SCRAPPING_LIMIT,
        });
        summaryByCategory.set(category, summary);
      }

      await sendNotification({
        summary,
        telegramUrl,
      });
    });
  }, 1000 * 60 * 60 * 24); // 24 hours
};
