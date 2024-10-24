import { Request, Response } from "express";
import axios from "axios";
import fs from "fs";
import path from "path";

// Assurez-vous que les variables d'environnement sont correctement définies.
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || "Votre clé API OpenAI ici";
const CONTAINER_MARKDOWN_FILES_FOLDER_PATH =
  process.env.CONTAINER_MARKDOWN_FILES_FOLDER_PATH ||
  "Chemin vers le dossier des fichiers markdown";

export const summarizeCategory = async (req: Request, res: Response) => {
  try {
    const { category, limit } = req.params;
    const categoryFolderPath = path.join(
      CONTAINER_MARKDOWN_FILES_FOLDER_PATH,
      category
    );
    const language = req.query.language || "English";

    // Assurez-vous que le répertoire existe
    if (!fs.existsSync(categoryFolderPath)) {
      return res.status(404).send("Category folder does not exist.");
    }

    const allFiles = fs.readdirSync(categoryFolderPath);

    // Vérifiez s'il y a des fichiers dans le dossier
    if (allFiles.length === 0) {
      return res.status(404).send("No files found in the category folder.");
    }

    const LIMIT = parseInt(limit, 10) || 1;
    const files = allFiles
      .filter((file) => file.endsWith(".md"))
      .slice(0, LIMIT);

    if (!files) {
      return res
        .status(404)
        .send("No markdown files found in the category folder.");
    }

    let summaries = [];

    for (const file of files) {
      const filePath = path.join(categoryFolderPath, file);
      const fileContent = fs.readFileSync(filePath, "utf-8");

      // Envoyer le contenu du fichier à GPT pour synthèse
      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "user",
              content:  `Imagine that you are writing a newletter which concept is to synthesize destined for readers. You are going to analyse this newsletter about ${category}. Do a synthesis IN ${language} and your answer HAS TO be markdown code. You can deviate from the format only if it's necessary and it corresponds better to the original post. only answer the markdown code. \n
              \n
              Here is the format of the answer you're gonna provide:
              ### [Title you found in the post]
              \n
              (please make important information bold and/or italic, try to keep the summary short and concise)
              - [Important information 1 (~1-2 sentences)]
              - [Important information 2 (~1-2 sentences)]
              - [Important information 3 (~1-2 sentences)]
              - [Last important information (~1-2 sentences)]
              \n
              [**Conclusion**, **Summary** or **Final thoughts**, depends on the content of the post]


              here is the post: ${fileContent}`,
            },
          ],
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${OPENAI_API_KEY}`,
          },
        }
      );

      const summary = response.data.choices[0].message.content;
      summaries.push({ summary });
    }
    res.json({ summaries });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error occurred while processing the summary.");
  }
};
