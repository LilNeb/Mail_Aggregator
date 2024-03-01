import { Request, Response } from "express";
import axios from "axios";
import fs from "fs";
import path from "path";

// Assurez-vous que les variables d'environnement sont correctement définies.
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || "Votre clé API OpenAI ici";
const CONTAINER_MARKDOWN_FILES_FOLDER_PATH = process.env.CONTAINER_MARKDOWN_FILES_FOLDER_PATH || "Chemin vers le dossier des fichiers markdown";

export const summarizeCategory = async (req: Request, res: Response) => {
    try {
        const category = req.params.category;
        const categoryFolderPath = path.join(CONTAINER_MARKDOWN_FILES_FOLDER_PATH, category);
        const language = req.query.language || "English";

        // Assurez-vous que le répertoire existe
        if (!fs.existsSync(categoryFolderPath)) {
            return res.status(404).send("Category folder does not exist.");
        }

        const files = fs.readdirSync(categoryFolderPath);

        // Vérifiez s'il y a des fichiers dans le dossier
        if (files.length === 0) {
            return res.status(404).send("No files found in the category folder.");
        }

        const firstFile = files.find(file => file.endsWith('.md')); // Assurez-vous de sélectionner un fichier Markdown
        if (!firstFile) {
            return res.status(404).send("No markdown files found in the category folder.");
        }

        const filePath = path.join(categoryFolderPath, firstFile);
        const fileContent = fs.readFileSync(filePath, "utf-8");

        // Envoyer le contenu du fichier à GPT pour synthèse
        const response = await axios.post(
            "https://api.openai.com/v1/chat/completions",
            {
                model: "gpt-3.5-turbo",
                messages: [{ role: "user", content: `Imagine that you are writing a newletter which concept is to synthesize destined for readers. Do not write anything else than the final synthesized text from the post. You are going to analyse this newsletter about ${category}. Do a synthesis IN ${language} only of very key informations in the form of bullet points with very short sentences (~6-7 words per bulletpoint). Also give the title aswell as the subject of the post as informative as possible in the beginning. Do not write the words "bullet points" or "summary" or any similar context words in the text.
                here is the post: ${fileContent}` }],
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${OPENAI_API_KEY}`,
                },
            }
        );

        const summary = response.data.choices[0].message.content;
        res.json({ summary });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error occurred while processing the summary.");
    }
};
